export interface KnowledgeArticle {
  id: string;
  title: string;
  shortSummary: string;
  fullArticle: string;
  featuredImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  category: string;
  subCategory?: string;
  tags: string[];
  readingTime: number; // minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated: string;
  isPremium?: boolean;
}

export interface LearningLesson {
  id: string;
  courseId: string;
  title: string;
  duration: string; // e.g. "10:15"
  videoUrl: string; // e.g. YouTube embed URL or mock URL
  summary: string;
  notes: string; // Markdown notes
  order: number;
}

export interface LearningCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  instructor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  totalDuration: string;
  isPremium?: boolean;
  badge?: string;
}

export interface BusinessTemplate {
  id: string;
  title: string;
  description: string;
  category: string; // e.g. "Finance", "SOP", "Pitch Deck"
  downloadUrl?: string;
  structure: {
    sectionName: string;
    points: string[];
  }[];
  tips: string[];
}

export interface SopItem {
  id: string;
  title: string;
  category: 'Sales' | 'Marketing' | 'Operations' | 'Manufacturing' | 'Quality' | 'Warehouse' | 'Customer Support' | 'Finance' | 'HR' | 'Admin' | 'Business Success Manager' | 'Research Executive';
  purpose: string;
  scope: string;
  responsibilities: string[];
  steps: {
    stepNo: number;
    title: string;
    action: string;
  }[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  completed: boolean;
}

export interface BusinessChecklist {
  id: string;
  title: string;
  description: string;
  category: string;
  items: ChecklistItem[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  overview: string;
  eligibility: string[];
  benefits: string[];
  documentsRequired: string[];
  applicationGuidance: string[];
  officialSource: string;
  lastUpdated: string;
  state?: string; // empty string or "Central" for central schemes
  industry: string;
  businessSize: 'Micro' | 'Small' | 'Medium' | 'All' | 'Startup';
  category: 'MSME' | 'Women' | 'SC/ST' | 'Export' | 'Manufacturing' | 'Agriculture' | 'Technology' | 'Startup Stage';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: {
    title: string;
    type: 'article' | 'video' | 'template' | 'checklist';
    refId: string; // e.g. articleId, courseId/lessonId, templateId, checklistId
    duration: string;
  }[];
}

export interface UserProgress {
  completedLessons: string[]; // lessonIds
  bookmarks: {
    articles: string[];
    videos: string[];
    templates: string[];
  };
  certificates: {
    courseId: string;
    issuedAt: string;
    badge: string;
  }[];
}
