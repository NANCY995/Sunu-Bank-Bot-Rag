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
