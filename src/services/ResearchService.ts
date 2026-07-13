import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PDFLayoutJSON {
  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    createdAt: string;
  };
  branding: {
    companyName: string;
    logoPlaceholder: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    footerText: string;
  };
  layout: {
    pageOrientation: 'portrait' | 'landscape';
    pageSize: 'A4' | 'letter';
    margins: { top: number; right: number; bottom: number; left: number };
  };
  content: {
    sections: {
      id: string;
      title: string;
      type: 'heading' | 'subheading' | 'text' | 'table' | 'bullets' | 'pageBreak' | 'callout';
      value?: string;
      items?: string[];
      tableData?: {
        headers: string[];
        rows: string[][];
        widths?: number[];
      };
    }[];
  };
}

/**
 * Helper to automate research ticket creation in Firestore, generating the 5-stage milestones,
 * selecting default executives based on business specifications, and linking basic metadata.
 */
export async function createAutomatedResearchTicket(
  user: { uid: string; email: string | null; displayName: string | null },
  selectedPackage: { id: string; name: string; price: string; timeline: string },
  formFields: { businessCategory: string; businessType: string; investment: string; city: string; state: string; country: string; pinCode: string },
  uploadedFiles: { name: string; size: string; category: string }[] = [],
  paymentMethod: string = 'In-App Ledger'
): Promise<{ success: boolean; ticketId?: string; ticketNumber?: string; error?: string }> {
  try {
    const orderId = `BXT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketNumber = `BXT-RES-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const dueDate = new Date();
    const totalDays = parseInt(selectedPackage.timeline) || 5;
    dueDate.setDate(dueDate.getDate() + totalDays);

    // Auto assignment matching rules
    let assignedExecutive = 'Rohan Das (Retail Specialist)';
    let assignedQALead = 'Pooja Patel (Quality Assurance Director)';
    const bizTypeLower = formFields.businessType.toLowerCase();
    const investLower = formFields.investment.toLowerCase();

    if (bizTypeLower.includes('manufacturing') || bizTypeLower.includes('oem')) {
      assignedExecutive = 'Kabir Mehta (Industrial Lead)';
      assignedQALead = 'Neha Sharma (Location Audit Expert)';
    } else if (investLower.includes('crore') || investLower.includes('50 lakhs') || investLower.includes('25 lakhs')) {
      assignedExecutive = 'Meera Nair (Finance Specialist)';
      assignedQALead = 'Rohan Mehra (Financial Modeling Lead)';
    } else if (bizTypeLower.includes('import') || bizTypeLower.includes('export')) {
      assignedExecutive = 'Ananya Sen (SME Analyst)';
      assignedQALead = 'Aravind Swamy (Senior SME Analyst)';
    }

    const milestoneOffsets = [1, Math.min(2, totalDays - 2), Math.min(3, totalDays - 1), Math.min(4, totalDays - 1), totalDays];
    const uniqueOffsets = Array.from(new Set(milestoneOffsets)).sort((a, b) => a - b);
    while (uniqueOffsets.length < 5) {
      uniqueOffsets.push(totalDays);
    }

    const projectTimeline = [
      { 
        milestone: "1. Desk Setup & File Verification", 
        daysOffset: uniqueOffsets[0], 
        action: `Analyst ${assignedExecutive.split(' (')[0]} parses submitted paperwork & MCA registers.`, 
        stageIndex: 2, 
        status: 'completed' 
      },
      { 
        milestone: "2. Primary Sourcing & Competitor Audits", 
        daysOffset: uniqueOffsets[1], 
        action: `Identify top regional competitors with lead reviewer ${assignedQALead.split(' (')[0]}.`, 
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

    const ticketData = {
      ticketNumber,
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
      priority: 'Medium',
      assignedExecutive,
      assignedQALead,
      projectTimeline,
      comments: [
        {
          sender: 'System Bot',
          senderRole: 'system',
          message: `Ticket automatically initiated. Our AI engine has matched "${selectedPackage.name}" and assigned it to specialist ${assignedExecutive} and QA lead ${assignedQALead}.`,
          timestamp: new Date().toISOString()
        }
      ],
      internalNotes: ''
    };

    const ticketRef = await addDoc(collection(db, 'research_tickets'), ticketData);

    // Link uploaded files if any
    for (const file of uploadedFiles) {
      await addDoc(collection(db, 'research_documents'), {
        ticketId: ticketRef.id,
        userId: user.uid,
        fileName: file.name,
        fileSize: file.size,
        category: file.category,
        uploadedAt: serverTimestamp()
      });
    }

    // Trigger notification
    await addDoc(collection(db, 'notifications'), {
      userId: user.uid,
      title: 'Premium Research Initiated & Analyst Matched',
      message: `Your payment for "${selectedPackage.name}" was processed. Research Ticket ${ticketNumber} is assigned to ${assignedExecutive}!`,
      type: 'success',
      read: false,
      createdAt: serverTimestamp()
    });

    return { success: true, ticketId: ticketRef.id, ticketNumber };
  } catch (error: any) {
    console.error('Failed to create automated research ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Assigns an executive to a ticket in Firestore.
 */
export async function assignExecutiveToTicket(
  ticketId: string,
  executiveName: string,
  qaLeadName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ticketRef = doc(db, 'research_tickets', ticketId);
    const updateData: any = {
      assignedExecutive: executiveName,
      updatedAt: serverTimestamp()
    };
    if (qaLeadName) {
      updateData.assignedQALead = qaLeadName;
    }
    await updateDoc(ticketRef, updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to assign executive to ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates a ticket's status in Firestore and automatically evaluates if a notification alert needs to be dispatched.
 */
export async function updateTicketStatusWithNotifications(
  ticketId: string,
  ticketNumber: string,
  nextStatus: string,
  userEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ticketRef = doc(db, 'research_tickets', ticketId);
    await updateDoc(ticketRef, {
      status: nextStatus,
      updatedAt: serverTimestamp()
    });

    // Automatically trigger Email & WhatsApp dispatch triggers
    await notifyResearchStageUpdate(ticketId, ticketNumber, userEmail, userName, nextStatus);

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update ticket status with notifications:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Triggers automated Email and WhatsApp notification templates via external integration hook
 * whenever a research ticket's status advances to 'Quality Assurance' or 'Completed'.
 */
export async function notifyResearchStageUpdate(
  ticketId: string,
  ticketNumber: string,
  userEmail: string,
  userName: string,
  status: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Normalize the status
  const normalizedStatus = status.toLowerCase();
  
  let templateId = '';
  let emailSubject = '';
  let whatsappTemplate = '';

  if (normalizedStatus === 'qa_review' || normalizedStatus === 'quality assurance') {
    templateId = 'tmpl_qa_review_stage';
    emailSubject = `[BizNxt Quality Assurance] Your Research Dossier ${ticketNumber} is under QA review`;
    whatsappTemplate = 'biznxt_qa_review_alert';
  } else if (normalizedStatus === 'completed' || normalizedStatus === 'approved') {
    templateId = 'tmpl_completed_stage';
    emailSubject = `🎉 [BizNxt Ready] Your Premium Business Dossier ${ticketNumber} is Fully Formatted & Ready!`;
    whatsappTemplate = 'biznxt_delivery_alert';
  } else {
    // Graceful exit: no notification needed for this stage
    return { success: true, error: `Stage ${status} does not trigger automated external alerts.` };
  }

  const variables = {
    userName: userName || 'Valued Partner',
    ticketNumber,
    status,
    timestamp: new Date().toISOString(),
    dashboardLink: `${window.location.origin}/premium-research`
  };

  const webhookUrl = import.meta.env.VITE_NOTIFICATIONS_WEBHOOK_URL || 'https://api.biznxt.com/v1/integrations/notify';

  try {
    console.log(`[Notification Engine] Triggering alerts for ticket ${ticketNumber}. Target: ${userEmail}. Status: ${status}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId,
        recipientEmail: userEmail,
        recipientName: userName,
        subject: emailSubject,
        whatsappTemplate,
        templateId,
        variables,
        systemId: 'BIZNXT_CORE_WORKFLOW_v3'
      })
    });

    if (!response.ok) {
      throw new Error(`External hook returned bad status code: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ status: 'dispatched_simulated' }));
    return { success: true, data };
  } catch (error: any) {
    // Standard failover: do not break execution if external hook fails, simply log it
    console.warn(`[Notification Hook Graceful Failover] External hook execution was bypass-saved: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Formats completed research order / ticket data into a structural layout JSON
 * compatible with standard PDF rendering tools (jsPDF, pdfmake, etc.),
 * utilizing customized branding and style placeholders.
 */
export function serializeResearchToPDFContext(ticket: any): PDFLayoutJSON {
  const findings = ticket.findings || {};
  const dateFormatted = ticket.createdAt 
    ? new Date(ticket.createdAt.seconds ? ticket.createdAt.seconds * 1000 : ticket.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return {
    metadata: {
      title: `Premium Business Dossier - ${ticket.packageName || 'Research Report'}`,
      author: 'BizNxt Research Executive Board',
      subject: `Investment & Market viability report for ${ticket.businessCategory || 'Selected Industry'}`,
      keywords: `BizNxt, ${ticket.businessCategory || 'Market Analysis'}, Research, viability, ${ticket.location || 'Local region'}`,
      createdAt: new Date().toISOString()
    },
    branding: {
      companyName: 'BizNxt Premium Consulting',
      logoPlaceholder: 'BIZNXT_VECTOR_BLACK_EMBOSS',
      primaryColor: '#0f172a', // slate-900
      secondaryColor: '#db2777', // pink-600
      accentColor: '#0ea5e9', // sky-500
      footerText: 'Confidentiality notice: This dossier is strictly compiled for the registered recipient. BizNxt consulting retains publishing copyrights.'
    },
    layout: {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      margins: { top: 40, right: 40, bottom: 40, left: 40 }
    },
    content: {
      sections: [
        // Title block
        {
          id: 'sec_title',
          title: 'PREMIUM BUSINESS INTELLIGENCE DOSSIER',
          type: 'heading',
          value: ticket.packageName || 'Custom Research Service'
        },
        // Callout box with ticket details
        {
          id: 'sec_meta_callout',
          title: 'Dossier Meta Identifiers',
          type: 'callout',
          value: `Ticket Ref: ${ticket.ticketNumber || 'N/A'}\nLocation Range: ${ticket.location || 'India Region'}\nProjected Capex Range: ${ticket.investment || 'Confidential'}\nCategory: ${ticket.businessCategory || 'General Viability'}\nDate Verified: ${dateFormatted}`
        },
        // Executive Summary
        {
          id: 'sec_executive_summary',
          title: '1. Executive Summary',
          type: 'text',
          value: findings.marketSize || 'The market study indicates highly favorable conditions for establishing this venture. Local target audience analysis supports a resilient customer acquisition strategy with low entry resistance.'
        },
        // Competitive Analysis Heading
        {
          id: 'sec_competitor_heading',
          title: '2. Competitive Landscape & Core Rivals',
          type: 'subheading'
        },
        {
          id: 'sec_competitors_content',
          title: 'Competitors text',
          type: 'text',
          value: findings.competitors || 'Direct and indirect rivals within the selected geographical bounds showcase healthy margin structures. Secondary players are focused on vanilla retail with minimal service layer optimization.'
        },
        // Table structure for investment structure
        {
          id: 'sec_financial_table',
          title: '3. Financial Capex Allocation Models',
          type: 'table',
          tableData: {
            headers: ['Capex Category', 'Standard Allocation', 'Viability Factor'],
            rows: [
              ['Primary Real Estate / Leases', '35.0%', 'Optimal Return'],
              ['Operational Plant & Machinery', '25.0%', 'High ROI'],
              ['Regulatory Compliance & Licences', '15.0%', 'Critical SLA'],
              ['Working Capital reserves', '15.0%', 'Safety Cushion'],
              ['Marketing & Customer Funneling', '10.0%', 'Scale Trigger']
            ],
            widths: [150, 150, 150]
          }
        },
        {
          id: 'sec_page_break_1',
          title: 'Page Break',
          type: 'pageBreak'
        },
        // SWOT analysis bullets
        {
          id: 'sec_swot_heading',
          title: '4. SWOT Analysis Assessment',
          type: 'subheading'
        },
        {
          id: 'sec_swot_list',
          title: 'SWOT list',
          type: 'bullets',
          items: [
            'STRENGTH: Strong brand loyalty indicators within high-density commercial spots.',
            'WEAKNESS: Initial supply chain latency due to regional logistics bottlenecks.',
            'OPPORTUNITY: Untapped e-commerce integration that can drive scale beyond regional limits.',
            'THREAT: Drastic variations in global raw material supply and tax tariffs.'
          ]
        },
        // Custom Answers / Special Notes
        {
          id: 'sec_specialist_notes',
          title: '5. Regional Regulatory & Custom Annexures',
          type: 'text',
          value: findings.customAnswers || 'All regional compliances (including GST registrations, local municipality commercial trade licenses) are validated against standard central schedules.'
        },
        // Project Milestones
        {
          id: 'sec_project_milestones',
          title: '6. Project Milestones',
          type: 'bullets',
          items: ticket.projectTimeline 
            ? ticket.projectTimeline.map((m: any) => `${m.milestone} - ${m.action} (Offset: ${m.daysOffset} days)`)
            : [
                'Milestone 1 - Desk Setup & File Verification',
                'Milestone 2 - Primary Sourcing & Competitor Audits'
              ]
        }
      ]
    }
  };
}
