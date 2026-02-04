import React, { useState, useRef, useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useTranslations } from '@/i18n/utils';

export interface StepItem {
  title: string;
  description: string;
  content?: ReactNode;
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  lang: 'es' | 'en';
}

export default function Stepper({
  steps,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  lang,
  ...rest
}: StepperProps) {
  const t = useTranslations(lang);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const totalSteps = steps.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-full overflow-hidden ${rest.className}`}>
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-app border border-main/20 shadow-2xl">
        
        {/* Indicadores con scroll lateral en móvil para evitar desbordamiento */}
        <div className="flex w-full items-center p-4 sm:p-6 bg-mono-lighter/5 rounded-t-3xl border-b border-main/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-full gap-2 sm:gap-4">
            {steps.map((_, index) => {
              const stepNumber = index + 1;
              return (
                <React.Fragment key={stepNumber}>
                  <StepIndicator
                    step={stepNumber}
                    currentStep={currentStep}
                    onClickStep={(clicked: number) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                  {index < totalSteps - 1 && (
                    <div className="flex-1 min-w-[15px] sm:min-w-[30px]">
                      <StepConnector isComplete={currentStep > stepNumber} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6 overflow-hidden"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent text-white font-bold text-lg sm:text-xl mb-2">
              {currentStep}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-main leading-tight">
              {t(steps[currentStep - 1]?.title)}
            </h3>
            <p className="text-base sm:text-lg opacity-70 leading-relaxed">
              {t(steps[currentStep - 1]?.description)}
            </p>
            {steps[currentStep - 1]?.content && (
              <div className="pt-4">{steps[currentStep - 1].content}</div>
            )}
          </div>
        </StepContentWrapper>

        {!isCompleted && (
          <div className="px-6 sm:px-8 pb-8 flex items-center justify-between">
            <button
              type='button'
              onClick={() => { setDirection(-1); updateStep(currentStep - 1); }}
              disabled={currentStep === 1}
              className={`text-sm font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100 text-main'}`}
            >
              ← {t('common.previous')}
            </button>
            <button
              type='button'
              onClick={isLastStep ? () => updateStep(totalSteps + 1) : () => { setDirection(1); updateStep(currentStep + 1); }}
              className="bg-accent text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 text-sm sm:text-base"
            >
              {isLastStep ? t('common.finish') : t('common.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }: any) {
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isCompleted) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [currentStep, isCompleted]);

  return (
    <motion.div
      animate={{ height: isCompleted ? 0 : (height === 'auto' ? 'auto' : height + 60) }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
      className={className}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {!isCompleted && (
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div ref={containerRef}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? '15%' : '-15%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? '-15%' : '15%', opacity: 0 })
};

function StepIndicator({ step, currentStep, onClickStep }: any) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div 
      onClick={() => onClickStep(step)}
      className="relative shrink-0 cursor-pointer"
      animate={status}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(120,120,120,0.1)', color: '#a3a3a3' },
          active: { scale: 1.1, backgroundColor: '#5227FF', color: '#fff' },
          complete: { scale: 1, backgroundColor: '#5227FF', color: '#fff' }
        }}
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm"
      >
        {status === 'complete' ? "✓" : step}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative h-0.5 w-full bg-main/10 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-accent"
        animate={{ width: isComplete ? '100%' : '0%' }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}