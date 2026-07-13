export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  contentTemplate: string;
  formFields: FormField[];
  isActive: boolean;
  version: number;
  createdAt: any;
  updatedAt: any;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface GeneratedDocument {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  category: string;
  formData: Record<string, any>;
  content: string;
  status: 'Draft' | 'Completed';
  version: number;
  createdAt: any;
  updatedAt: any;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  formData: Record<string, any>;
  version: number;
  createdAt: any;
  actorName: string;
}
