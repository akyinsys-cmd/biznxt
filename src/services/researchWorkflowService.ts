import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Operation types for Firestore error tracking
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

// Standard Firestore error handler adhering to SDK guides
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId?: string | null, email?: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: userId || null,
      email: email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface WorkflowTriggerParams {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
  selectedPackage: {
    id: string;
    name: string;
    price: string;
    priceVal: number;
    timeline: string;
  };
  formFields: {
    businessCategory: string;
    businessType: string;
    investment: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  uploadedFiles: { name: string; size: string; category: string }[];
  paymentMethod: string;
}

/**
 * Executes the automated research workflow trigger upon payment success.
 * Generates an order, matches/assigns an executive and QA lead, constructs a custom
 * project timeline, creates the ticket, and delivers notifications.
 */
export async function triggerPaymentSuccessWorkflow(params: WorkflowTriggerParams) {
  const { user, selectedPackage, formFields, uploadedFiles, paymentMethod } = params;

  const orderId = `BXT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticketNo = `BXT-RES-${Math.floor(10000 + Math.random() * 90000)}`;
  
  const dueDate = new Date();
  const totalDays = parseInt(selectedPackage.timeline) || 5;
  dueDate.setDate(dueDate.getDate() + totalDays);

  // 1. Executive and QA Lead auto-assignment logic
  let assignedExec = 'Rohan Das (Retail Specialist)';
  let assignedQA = 'Pooja Patel (Quality Assurance Director)';
  const bizTypeLower = formFields.businessType.toLowerCase();
  const investLower = formFields.investment.toLowerCase();

  if (bizTypeLower.includes('manufacturing') || bizTypeLower.includes('oem')) {
    assignedExec = 'Kabir Mehta (Industrial Lead)';
    assignedQA = 'Neha Sharma (Location Audit Expert)';
  } else if (investLower.includes('crore') || investLower.includes('50 lakhs') || investLower.includes('25 lakhs')) {
    assignedExec = 'Meera Nair (Finance Specialist)';
    assignedQA = 'Rohan Mehra (Financial Modeling Lead)';
  } else if (bizTypeLower.includes('import') || bizTypeLower.includes('export') || bizTypeLower.includes('white label')) {
    assignedExec = 'Ananya Sen (SME Analyst)';
    assignedQA = 'Aravind Swamy (Senior SME Analyst)';
  }

  // 2. Build personalized 5-stage milestone timeline
  const milestoneOffsets = [1, Math.min(2, totalDays - 2), Math.min(3, totalDays - 1), Math.min(4, totalDays - 1), totalDays];
  const uniqueOffsets = Array.from(new Set(milestoneOffsets)).sort((a, b) => a - b);
  while (uniqueOffsets.length < 5) {
    uniqueOffsets.push(totalDays);
  }

  const projectTimeline = [
    { 
      milestone: "1. Desk Setup & File Verification", 
      daysOffset: uniqueOffsets[0], 
      action: `Analyst ${assignedExec.split(' (')[0]} parses submitted paperwork & MCA registers.`, 
      stageIndex: 2, 
      status: 'completed' 
    },
    { 
      milestone: "2. Primary Sourcing & Competitor Audits", 
      daysOffset: uniqueOffsets[1], 
      action: `Identify top regional competitors with lead reviewer ${assignedQA.split(' (')[0]}.`, 
      stageIndex: 5, 
      status: 'pending' 
    },
    { 
      milestone: "3. Capex Allocation & Working Capital Model", 
      daysOffset: uniqueOffsets[2], 
      action: "Build 5-year CAGR estimates & cost breakdown.", 
      stageIndex: 6, 
      status: 'pending' 
    },
    { 
      milestone: "4. SWOT Drafting & Reference Assembly", 
      daysOffset: uniqueOffsets[3], 
      action: "Assemble risk mitigation matrix and references.", 
      stageIndex: 7, 
      status: 'pending' 
    },
    { 
      milestone: "5. QA Review & Multi-format PDF Delivery", 
      daysOffset: uniqueOffsets[4], 
      action: "Audit peer checklist & lock dynamic PDF download.", 
      stageIndex: 10, 
      status: 'pending' 
    }
  ];

  // 3. Assemble documents data
  const newOrderData = {
    orderId,
    userId: user.uid,
    userEmail: user.email || '',
    userName: user.displayName || 'Enterprise User',
    packageId: selectedPackage.id,
    packageName: selectedPackage.name,
    price: selectedPackage.price,
    priceVal: selectedPackage.priceVal,
    status: 'Paid',
    createdAt: serverTimestamp()
  };

  const newTicketData = {
    ticketNumber: ticketNo,
    orderId,
    userId: user.uid,
    userEmail: user.email || '',
    userName: user.displayName || 'Enterprise User',
    packageId: selectedPackage.id,
    packageName: selectedPackage.name,
    businessCategory: formFields.businessCategory,
    businessType: formFields.businessType,
    investment: formFields.investment,
    location: `${formFields.city}, ${formFields.state}, ${formFields.country} (${formFields.pinCode})`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    dueDate: dueDate.toISOString().split('T')[0],
    status: 'assigned',
    priority: 'Medium' as const,
    assignedExecutive: assignedExec,
    assignedQALead: assignedQA,
    projectTimeline,
    comments: [
      {
        sender: 'System Bot',
        senderRole: 'system',
        message: `Premium ticket created successfully! Our automated AI workflow engine has matched your request for "${selectedPackage.name}" and assigned your ticket to specialist: ${assignedExec} with QA Lead review by ${assignedQA}. Your custom 5-stage project timeline milestones have been generated successfully.`,
        timestamp: new Date().toISOString()
      }
    ],
    internalNotes: ''
  };

  const paymentRecord = {
    orderId,
    ticketNumber: ticketNo,
    userId: user.uid,
    userEmail: user.email || '',
    packageName: selectedPackage.name,
    amount: selectedPackage.price,
    paymentMethod,
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: 'Success',
    createdAt: serverTimestamp()
  };

  // Perform Firestore writes inside a cohesive workflow block with handling
  try {
    // A. Create research_orders document
    let orderRef;
    try {
      orderRef = await addDoc(collection(db, 'research_orders'), newOrderData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'research_orders', user.uid, user.email);
    }

    // B. Create research_tickets document
    let ticketRef;
    try {
      ticketRef = await addDoc(collection(db, 'research_tickets'), newTicketData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'research_tickets', user.uid, user.email);
    }

    // C. Create research_payments document
    try {
      await addDoc(collection(db, 'research_payments'), paymentRecord);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'research_payments', user.uid, user.email);
    }

    // D. Link uploaded attachments to ticket
    if (ticketRef) {
      for (const file of uploadedFiles) {
        try {
          await addDoc(collection(db, 'research_documents'), {
            ticketId: ticketRef.id,
            userId: user.uid,
            fileName: file.name,
            fileSize: file.size,
            category: file.category,
            uploadedAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'research_documents', user.uid, user.email);
        }
      }
    }

    // E. Create client in-app notification
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Premium Research Initiated & Analyst Matched',
        message: `Your payment of ${selectedPackage.price} for "${selectedPackage.name}" has been processed. Research Ticket ${ticketNo} is assigned to ${assignedExec}!`,
        type: 'success',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'notifications', user.uid, user.email);
    }

    return {
      orderId,
      ticketNo,
      ticketId: ticketRef?.id || ''
    };
  } catch (err) {
    console.error("Workflow trigger execution failed: ", err);
    throw err;
  }
}
