export type ScreenType = 
  | 'login'
  | 'concierge-home' 
  | 'concierge-chat'
  | 'admin';

export interface SimulationData {
  productId: string;
  productName: string;
  category: string;
  monthlyAmount: number;
  durationYears: number;
  totalContributed: number;
  guaranteedCapital: number;
  specificBenefit: string;
  fidelityBonus?: number;
  quarterlyPension?: number;
  deathDisabilityGuarantee: string;
  cimaMentions: string;
}

export interface RagInspectorData {
  queryTransformation: {
    originalQuery: string;
    canonicalQuery: string;
    extractedEntities: string[];
    intent: string;
    subQueries?: string[];
  };
  fusionRetrieval: {
    technique: string;
    retrievedDocuments: Array<{
      id: string;
      title: string;
      category: string;
      rrfScore: number;
      relevancePct: number;
      explanation: string;
    }>;
  };
  complianceCheckpoints: {
    cimaArticle6: boolean;
    cimaArticle74?: boolean;
    cimaArticle76: boolean;
    cimaArticle84?: boolean;
    bceaoPrudential?: boolean;
    faithfulnessScore: number;
    cimaComplianceScore: string;
  };
  metrics: {
    latencyMs: number;
    mrr: number;
    hitAt5: string;
    status: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredData?: {
    product?: string;
    startingPrice?: string;
    coverage?: string;
    benefits?: Array<{ label: string; detail: string }>;
    simulation?: SimulationData;
    ragInspector?: RagInspectorData;
  } | null;
  sources?: Array<{ id: string; title: string; category: string }>;
}

export interface OnboardingStep {
  stepNumber: number;
  id: string;
  title: string;
  subtitle: string;
  moduleBadge: string;
  icon: string;
  description: string;
  imageAlt: string;
  imageUrl: string;
}

export interface RagDocument {
  id: string;
  title: string;
  category: string;
  coverage?: string;
  startingPrice?: string;
  rates?: string;
  yield?: string;
  benefits?: string[];
  eligibility?: string;
  highlights?: string;
  compliance?: string;
}
