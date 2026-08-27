import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Brain, TrendingUp, Shield, LogIn } from 'lucide-react';
import { Footer } from '../components/Footer';

interface OnboardingViewProps {
  onCompleteOnboarding: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onCompleteOnboarding }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      badge: 'CORE MODULE',
      icon: 'neurology',
      title: 'Intelligence Engine',
      label: 'Intelligence',
      description:
        'Harness the power of Retrieval-Augmented Generation (RAG) to instantly query vast institutional knowledge bases. Extract precise insights, verified citations, and comprehensive summaries from complex financial documents in milliseconds.',
      nextLabel: 'Next: Predictive Analytics',
      // High quality SVG neural network visualization for crisp rendering
      visualType: 'neural',
    },
    {
      step: 2,
      badge: 'ANALYSIS MODULE',
      icon: 'monitoring',
      title: 'Predictive Analytics',
      label: 'Analytics',
      description:
        'Anticipate market shifts with high-fidelity forecasting models. Our predictive suite transforms raw data into actionable trajectories, allowing you to model various economic scenarios with institutional-grade accuracy.',
      nextLabel: 'Next: Risk Management',
      visualType: 'analytics',
    },
    {
      step: 3,
      badge: 'SECURITY MODULE',
      icon: 'shield',
      title: 'Risk Management',
      label: 'Risk',
      description:
        'Operate securely within predefined parameters. Our robust risk management framework continuously monitors queries and outputs, ensuring strict compliance with regulatory standards and safeguarding sensitive financial data.',
      nextLabel: 'Get Started',
      visualType: 'security',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between bg-[#131313] text-[#e2e2e2] font-sans">
      {/* Top Header */}
      <main className="w-full max-w-6xl mx-auto px-4 md:px-10 py-10 flex-1 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-3 tracking-tight text-[#e2e2e2]">
            Welcome to SUNU Bank Togo RAG Portal
          </h1>
          <p className="text-base md:text-lg text-[#c6c6c7] max-w-2xl mx-auto leading-relaxed">
            Your advanced financial intelligence platform. Navigate through our cutting-edge tools designed for precision, stability, and institutional trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto w-full items-center">
          {/* Stepped Navigation / Progress Line */}
          <div className="md:col-span-3 hidden md:flex flex-col relative pt-4">
            {/* Base grey line */}
            <div className="absolute left-[13px] top-10 bottom-10 w-[2px] bg-[#1E1E1E]"></div>
            {/* Active red progress line */}
            <div
              className="absolute left-[13px] top-10 w-[2px] bg-[#E21E26] transition-all duration-500 ease-out"
              style={{
                height: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            ></div>

            {/* Step Items */}
            {steps.map((item) => {
              const isActive = currentStep >= item.step;
              const isCurrent = currentStep === item.step;

              return (
                <button
                  key={item.step}
                  onClick={() => setCurrentStep(item.step)}
                  className="flex items-center gap-4 mb-14 last:mb-0 relative z-10 text-left cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'border border-[#E21E26] bg-[#E21E26] text-white shadow-[0_0_12px_rgba(226,30,38,0.4)]'
                        : 'border border-[#2D2D2D] bg-[#131313] text-[#777777] group-hover:border-[#555555]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span
                    className={`font-heading text-base font-semibold transition-colors ${
                      isCurrent
                        ? 'text-white'
                        : isActive
                        ? 'text-[#e2e2e2]'
                        : 'text-[#777777] group-hover:text-[#A3A3A3]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Content Card */}
          <div className="col-span-1 md:col-span-9 relative min-h-[420px]">
            <div className="bg-[#121212] border border-[#1E1E1E] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden transition-all duration-500">
              {/* Subtle Red Accent Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E21E26] via-[#E21E26]/50 to-transparent"></div>

              {/* Text & Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span
                      className="material-symbols-outlined text-[#E21E26] text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {currentStepData.icon}
                    </span>
                    <span className="font-mono-code text-xs tracking-widest text-[#E21E26] uppercase font-bold">
                      {currentStepData.badge}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-[#e2e2e2]">
                    {currentStepData.title}
                  </h2>

                  <p className="text-[#c6c6c7] text-base leading-relaxed mb-6 font-sans">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-auto pt-4 flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      id="onboarding-prev-btn"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="border border-[#2D2D2D] hover:border-[#555555] text-[#A3A3A3] hover:text-white px-4 py-3 rounded text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      id="onboarding-next-btn"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="bg-[#1B1B1B] border border-[#2D2D2D] hover:border-[#E21E26] text-[#e2e2e2] px-6 py-3 rounded text-sm font-medium transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <span>{currentStepData.nextLabel}</span>
                      <ArrowRight className="w-4 h-4 text-[#E21E26] transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <button
                      id="onboarding-complete-btn"
                      onClick={onCompleteOnboarding}
                      className="bg-[#E21E26] hover:bg-[#c00017] text-white px-8 py-3 rounded font-heading font-semibold text-base transition-all glow-red flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(226,30,38,0.4)]"
                    >
                      <span>Get Started</span>
                      <LogIn className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* High-Tech Visualization Card */}
              <div className="w-full md:w-1/2 min-h-[220px] md:min-h-[280px] relative rounded-lg border border-[#1E1E1E] overflow-hidden bg-black flex items-center justify-center p-4">
                {/* Visual 1: Intelligence Engine / Neural Nodes */}
                {currentStepData.visualType === 'neural' && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 400 240" className="w-full h-full opacity-80">
                      {/* Grid background */}
                      <defs>
                        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#E21E26" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#E21E26" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                      {/* Connecting glow lines */}
                      <path d="M 50 120 Q 200 40 350 120" stroke="url(#neuralGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
                      <path d="M 50 120 Q 200 200 350 120" stroke="url(#neuralGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
                      <path d="M 80 70 L 200 120 L 320 70" stroke="#444444" strokeWidth="1" fill="none" />
                      <path d="M 80 170 L 200 120 L 320 170" stroke="#444444" strokeWidth="1" fill="none" />
                      <line x1="50" y1="120" x2="350" y2="120" stroke="#E21E26" strokeWidth="2" opacity="0.4" strokeDasharray="4 4" />

                      {/* Nodes */}
                      <circle cx="50" cy="120" r="8" fill="#E21E26" />
                      <circle cx="80" cy="70" r="5" fill="#e2e2e2" opacity="0.8" />
                      <circle cx="80" cy="170" r="5" fill="#e2e2e2" opacity="0.8" />
                      <circle cx="200" cy="120" r="12" fill="#1B1B1B" stroke="#E21E26" strokeWidth="3" />
                      <circle cx="200" cy="120" r="4" fill="#ffffff" />
                      <circle cx="320" cy="70" r="5" fill="#e2e2e2" opacity="0.8" />
                      <circle cx="320" cy="170" r="5" fill="#e2e2e2" opacity="0.8" />
                      <circle cx="350" cy="120" r="8" fill="#E21E26" />

                      {/* Floating metadata label */}
                      <text x="200" y="205" textAnchor="middle" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono">
                        SUNU RAG VECTOR EMBEDDING v2.4
                      </text>
                    </svg>
                    <div className="absolute bottom-2 text-center text-[10px] text-[#777777] font-mono-code">
                      KNOWLEDGE RETRIEVAL LATENCY &lt; 24ms
                    </div>
                  </div>
                )}

                {/* Visual 2: Predictive Analytics / Trajectories */}
                {currentStepData.visualType === 'analytics' && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 400 240" className="w-full h-full opacity-80">
                      {/* Grid lines */}
                      <line x1="40" y1="40" x2="360" y2="40" stroke="#1E1E1E" strokeWidth="1" />
                      <line x1="40" y1="90" x2="360" y2="90" stroke="#1E1E1E" strokeWidth="1" />
                      <line x1="40" y1="140" x2="360" y2="140" stroke="#1E1E1E" strokeWidth="1" />
                      <line x1="40" y1="190" x2="360" y2="190" stroke="#2D2D2D" strokeWidth="1.5" />

                      {/* Area Chart Gradient */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#E21E26" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#E21E26" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 50 160 L 100 140 L 150 145 L 200 110 L 250 120 L 300 70 L 350 50 L 350 190 L 50 190 Z"
                        fill="url(#chartGrad)"
                      />
                      {/* Trend line */}
                      <path
                        d="M 50 160 L 100 140 L 150 145 L 200 110 L 250 120 L 300 70 L 350 50"
                        stroke="#E21E26"
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Data dots */}
                      <circle cx="200" cy="110" r="4" fill="#ffffff" />
                      <circle cx="300" cy="70" r="4" fill="#ffffff" />
                      <circle cx="350" cy="50" r="5" fill="#E21E26" stroke="#ffffff" strokeWidth="2" />

                      <text x="350" y="38" textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                        +18.4% YIELD
                      </text>
                    </svg>
                    <div className="absolute bottom-2 text-center text-[10px] text-[#777777] font-mono-code">
                      MONTE CARLO PROJECTION • 5YR CONFIDENCE 99.2%
                    </div>
                  </div>
                )}

                {/* Visual 3: Risk Management / Shield Frame */}
                {currentStepData.visualType === 'security' && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 400 240" className="w-full h-full opacity-80">
                      {/* Concentric risk circles */}
                      <circle cx="200" cy="110" r="80" stroke="#222222" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      <circle cx="200" cy="110" r="55" stroke="#2D2D2D" strokeWidth="1" fill="none" />

                      {/* Shield polygon */}
                      <path
                        d="M 200 50 L 245 70 L 245 125 C 245 155 200 175 200 175 C 200 175 155 155 155 125 L 155 70 Z"
                        fill="#1B1B1B"
                        stroke="#E21E26"
                        strokeWidth="2.5"
                      />
                      {/* Inner checkmark / lock symbol */}
                      <path
                        d="M 185 110 L 196 122 L 218 96"
                        stroke="#ffffff"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <text x="200" y="205" textAnchor="middle" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono">
                        AES-256 GCM • BCEAO / UMOA COMPLIANT
                      </text>
                    </svg>
                    <div className="absolute bottom-2 text-center text-[10px] text-[#777777] font-mono-code">
                      REALTIME AUDIT LOGGING ACTIVE
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
