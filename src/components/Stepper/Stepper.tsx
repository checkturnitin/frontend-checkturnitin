import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-[400px] w-full max-w-xl flex-col items-center justify-center p-4"
      {...rest}
    >
      <div className="relative w-full">
        <div
          className={`mx-auto w-full rounded-2xl ${stepCircleContainerClassName}`}
          style={{ 
            border: "2px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(12px)"
          }}
        >
          <ShineBorder
            borderWidth={6}
            duration={8}
            shineColor={["rgba(99, 102, 241, 0.2)", "rgba(168, 85, 247, 0.4)", "rgba(236, 72, 153, 0.2)"]}
            className="rounded-2xl"
          />
          <div
            className={`${stepContainerClassName} flex w-full items-center justify-center p-6`}
          >
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <div className="relative">
                      <ShineBorder
                        borderWidth={4}
                        duration={12}
                        shineColor={["rgba(99, 102, 241, 0.2)", "rgba(168, 85, 247, 0.3)", "rgba(236, 72, 153, 0.2)"]}
                        className="rounded-full"
                      />
                      <StepIndicator
                        step={stepNumber}
                        disableStepIndicators={disableStepIndicators}
                        currentStep={currentStep}
                        onClickStep={(clicked) => {
                          setDirection(clicked > currentStep ? 1 : -1);
                          updateStep(clicked);
                        }}
                      />
                    </div>
                  )}
                  {isNotLastStep && (
                    <StepConnector isComplete={currentStep > stepNumber} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`min-h-[300px] w-full ${contentClassName}`}
          >
            <div className="h-full w-full px-6 py-6">
              {stepsArray[currentStep - 1]}
            </div>
          </StepContentWrapper>

          {!isCompleted && (
            <div className={`px-6 pb-6 ${footerClassName}`}>
              <div
                className={`mt-4 flex ${
                  currentStep !== 1 ? "justify-between" : "justify-end"
                }`}
              >
                {currentStep !== 1 && (
                  <div className="relative">
                    <button
                      onClick={handleBack}
                      className={`relative duration-350 rounded-lg border-2 border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40 hover:text-white hover:scale-105 active:scale-95 ${
                        currentStep === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                      {...backButtonProps}
                    >
                      {backButtonText}
                    </button>
                  </div>
                )}
                <div className="relative">
                  <button
                    onClick={isLastStep ? handleComplete : handleNext}
                    className="relative duration-350 flex items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 py-2 px-6 font-medium tracking-tight text-white transition hover:border-white/40 hover:bg-white/20 hover:scale-105 active:scale-95"
                    {...nextButtonProps}
                  >
                    {isLastStep ? "Complete" : nextButtonText}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = "",
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="px-8">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, borderColor: "rgba(255, 255, 255, 0.1)", color: "rgba(255, 255, 255, 0.4)" },
          active: { scale: 1.1, borderColor: "rgba(255, 255, 255, 0.4)", color: "rgba(255, 255, 255, 0.8)" },
          complete: { scale: 1, borderColor: "rgba(255, 255, 255, 0.4)", color: "rgba(255, 255, 255, 0.8)" },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold shadow-lg"
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : status === "active" ? (
          <div className="h-2.5 w-2.5 rounded-full bg-white/80" />
        ) : (
          <span className="text-sm text-white/60">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "rgba(255, 255, 255, 0.1)" },
    complete: { width: "100%", backgroundColor: "rgba(255, 255, 255, 0.4)" },
  };

  return (
    <div className="relative mx-4 h-0.5 flex-1 overflow-hidden rounded bg-white/10">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
