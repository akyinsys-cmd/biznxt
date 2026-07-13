import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';
import { DocumentTemplate } from './types/document';

const templates: Partial<DocumentTemplate>[] = [
  {
    name: "Non-Disclosure Agreement (NDA)",
    category: "Legal",
    description: "Standard mutual NDA for protecting confidential information.",
    isActive: true,
    version: 1,
    formFields: [
      { id: "party1", label: "Disclosing Party Name", type: "text", required: true },
      { id: "party2", label: "Receiving Party Name", type: "text", required: true },
      { id: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { id: "state", label: "Governing State", type: "text", required: true },
    ],
    contentTemplate: `
      <div style="font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 40px; background: white; border: 1px solid #eee;">
        <h1 style="text-align: center; margin-bottom: 2rem;">Mutual Non-Disclosure Agreement</h1>
        <p>This Non-Disclosure Agreement (the "Agreement") is entered into on <strong>{{effectiveDate}}</strong>, by and between:</p>
        <p><strong>{{party1}}</strong> (the "Disclosing Party")</p>
        <p>AND</p>
        <p><strong>{{party2}}</strong> (the "Receiving Party")</p>
        <h2>1. Confidential Information</h2>
        <p>The Receiving Party understands that the Disclosing Party has disclosed or may disclose business, technical or financial information relating to the Disclosing Party's business.</p>
        <h2>2. Obligations</h2>
        <p>The Receiving Party agrees to take reasonable measures to protect the secrecy of and avoid disclosure and unauthorized use of the Confidential Information.</p>
        <h2>3. Governing Law</h2>
        <p>This Agreement shall be governed by the laws of the State of <strong>{{state}}</strong>.</p>
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div>
            <p>_______________________</p>
            <p>Signature ({{party1}})</p>
          </div>
          <div>
            <p>_______________________</p>
            <p>Signature ({{party2}})</p>
          </div>
        </div>
      </div>
    `
  },
  {
    name: "Service Level Agreement (SLA)",
    category: "Agreements",
    description: "Defines the level of service expected from a vendor, laying out the metrics by which service is measured.",
    isActive: true,
    version: 1,
    formFields: [
      { id: "clientName", label: "Client Name", type: "text", required: true },
      { id: "providerName", label: "Service Provider", type: "text", required: true },
      { id: "uptimePercentage", label: "Uptime Commitment (%)", type: "number", required: true },
      { id: "effectiveDate", label: "Effective Date", type: "date", required: true }
    ],
    contentTemplate: `
      <div style="font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 40px; background: white; border: 1px solid #eee;">
        <h1 style="text-align: center; margin-bottom: 2rem; color: #1e293b;">Service Level Agreement</h1>
        <p>Effective Date: <strong>{{effectiveDate}}</strong></p>
        <p>This agreement is between <strong>{{providerName}}</strong> and <strong>{{clientName}}</strong>.</p>
        <h2>1. Service Commitment</h2>
        <p><strong>{{providerName}}</strong> will provide <strong>{{uptimePercentage}}%</strong> uptime for the services described herein.</p>
        <h2>2. Maintenance</h2>
        <p>Scheduled maintenance will be communicated at least 24 hours in advance.</p>
        <div style="margin-top: 50px;">
          <p>Approved By:</p>
          <div style="display: flex; gap: 40px;">
            <div>
              <p>_______________________</p>
              <p>{{clientName}}</p>
            </div>
            <div>
              <p>_______________________</p>
              <p>{{providerName}}</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: "Employee Offer Letter",
    category: "HR",
    description: "Professional job offer letter template with compensation details.",
    isActive: true,
    version: 1,
    formFields: [
      { id: "candidateName", label: "Candidate Name", type: "text", required: true },
      { id: "jobTitle", label: "Job Title", type: "text", required: true },
      { id: "salary", label: "Annual Salary", type: "number", required: true },
      { id: "startDate", label: "Start Date", type: "date", required: true },
      { id: "companyName", label: "Company Name", type: "text", required: true }
    ],
    contentTemplate: `
      <div style="font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 40px; background: white; border: 1px solid #eee;">
        <h1 style="text-align: center; margin-bottom: 2rem; color: #1e293b;">{{companyName}}</h1>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 2rem;" />
        <p>Dear <strong>{{candidateName}}</strong>,</p>
        <p>We are thrilled to offer you the position of <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong>.</p>
        <p>Your starting salary will be <strong>{{salary}}</strong> per year, paid according to the company's standard payroll schedule.</p>
        <p>Your anticipated start date is <strong>{{startDate}}</strong>.</p>
        <p>We believe your skills and experience will be a valuable asset to our team. Please sign below to accept this offer.</p>
        <div style="margin-top: 50px;">
          <p>Sincerely,</p>
          <p>HR Department</p>
          <p>{{companyName}}</p>
        </div>
        <div style="margin-top: 50px;">
          <p>Accepted By:</p>
          <p>_______________________</p>
          <p>{{candidateName}}</p>
        </div>
      </div>
    `
  }
];

export async function seedDocumentTemplates() {
  const snap = await getDocs(collection(db, 'document_templates'));
  if (snap.docs.length > 0) {
    console.log("Templates already exist");
    return;
  }

  for (const template of templates) {
    await addDoc(collection(db, 'document_templates'), {
      ...template,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  console.log("Seeded document templates!");
}
