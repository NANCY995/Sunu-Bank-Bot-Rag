import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Lock, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';

interface MfaViewProps {
  onMfaSuccess: () => void;
  onBackToLogin: () => void;
}

export const MfaView: React.FC<MfaViewProps> = ({ onMfaSuccess, onBackToLogin }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerActive, timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    // Only take the last character typed if single entry
    const cleaned = value.replace(/\D/g, '');
    const char = cleaned.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg('');

    // If character entered, move focus to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Veuillez renseigner l’intégralité du code à 6 chiffres.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsVerifying(false);
      onMfaSuccess();
    }, 700);
  };

  const handleResend = () => {
    setTimeLeft(30);
    setIsTimerActive(true);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between bg-[#131313] text-[#e2e2e2] relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E21E26] rounded-full opacity-5 blur-[120px] pointer-events-none"
        ></div>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[480px] mx-auto px-4 md:px-0 flex flex-col gap-6 my-auto py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1E1E1E] border border-[#2D2D2D] text-[#E21E26] mb-4 shadow-lg">
            <span className="material-symbols-outlined text-[40px] text-[#E21E26]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock_clock
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2 text-[#e2e2e2]">
            Security Verification
          </h1>
          <p className="text-base text-[#A3A3A3] leading-relaxed">
            To continue to the portal, please enter the 6-digit code sent to your registered device ending in{' '}
            <strong className="text-[#e2e2e2] font-semibold">**56</strong>.
          </p>
        </div>

        {/* MFA Card */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6 md:p-10 relative overflow-hidden shadow-2xl">
          {/* Security Stripe Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E21E26]"></div>

          <form onSubmit={handleVerify} className="flex flex-col gap-6" id="mfa-form">
            {errorMsg && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs p-3 rounded text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <label className="font-mono-code text-xs text-[#A3A3A3] uppercase tracking-widest font-semibold">
                ENTER CODE
              </label>

              {/* 6 OTP Inputs with Center Divider */}
              <div className="flex gap-2 justify-center items-center" id="otp-container">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    className="input-mfa w-11 h-14 bg-black border border-[#2D2D2D] rounded text-center font-heading text-xl font-bold text-[#e2e2e2] focus:border-[#E21E26] focus:outline-none focus:ring-1 focus:ring-[#E21E26] caret-[#E21E26] transition-colors"
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digits[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                  />
                ))}

                {/* Divider */}
                <div className="w-3 flex items-center justify-center">
                  <span className="w-2 h-[2px] bg-[#2D2D2D] block"></span>
                </div>

                {[3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    className="input-mfa w-11 h-14 bg-black border border-[#2D2D2D] rounded text-center font-heading text-xl font-bold text-[#e2e2e2] focus:border-[#E21E26] focus:outline-none focus:ring-1 focus:ring-[#E21E26] caret-[#E21E26] transition-colors"
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digits[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              {/* Quick autofill helper for ease of demo */}
              <div className="text-[11px] text-[#777777]">
                <button
                  type="button"
                  onClick={() => {
                    setDigits(['8', '4', '2', '9', '5', '6']);
                    inputRefs.current[5]?.focus();
                  }}
                  className="hover:text-[#A3A3A3] underline decoration-dotted"
                >
                  (Insérer le code démo: 842-956)
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <div className="mt-2">
              <button
                id="mfa-verify-btn"
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#E21E26] text-white font-heading font-semibold text-lg py-3 rounded hover:bg-[#c00017] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#131313] focus:ring-[#E21E26] glow-active flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{isVerifying ? 'Vérification en cours...' : 'Verify'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Resend Code Section */}
            <div className="text-center mt-1">
              {!isTimerActive ? (
                <button
                  id="resend-code-btn"
                  onClick={handleResend}
                  type="button"
                  className="text-sm text-[#A3A3A3] hover:text-[#e2e2e2] underline transition-colors"
                >
                  Resend Code
                </button>
              ) : (
                <div className="font-mono-code text-xs text-[#A3A3A3]" id="resend-timer">
                  Resend available in <span id="time-left" className="text-[#e2e2e2] font-bold">{timeLeft}</span>s
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Support Link */}
        <div className="text-center mt-4">
          <p className="font-mono-code text-xs text-[#A3A3A3]">
            Need help?{' '}
            <button
              onClick={() => setShowSupportModal(true)}
              className="text-[#E21E26] underline hover:text-[#ffb4ac] transition-colors"
            >
              Contact Support
            </button>
          </p>
        </div>
      </main>

      {/* Support Dialog */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#191919] border border-[#2D2D2D] rounded-xl max-w-md w-full p-6 text-[#e2e2e2] shadow-2xl relative">
            <div className="flex items-center gap-2 text-[#E21E26] font-heading font-bold text-lg mb-4">
              <HelpCircle className="w-5 h-5" />
              <h3>Support Technique & Sécurité SUNU</h3>
            </div>
            <div className="space-y-3 text-sm text-[#A3A3A3] leading-relaxed">
              <p>
                Si vous ne recevez pas le code OTP par SMS sur votre numéro se terminant par **56, veuillez contacter le centre d'assistance :
              </p>
              <div className="bg-[#121212] p-3 rounded-lg border border-[#2A2A2A] space-y-1 font-mono-code text-xs text-[#e2e2e2]">
                <div>• Support Téléphonique : +228 22 23 45 67</div>
                <div>• Email : security-desk@sunubank.com</div>
                <div>• Heures d'ouverture : 24/7 Service VIP</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="bg-[#E21E26] hover:bg-[#c00017] text-white px-5 py-2 rounded font-medium text-sm transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};
