"use client";

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, type MotionProps, useInView } from "framer-motion";
import { cn } from "@/utils/cn";

interface SequenceContextValue {
  completeItem: (index: number) => void;
  activeIndex: number;
  sequenceStarted: boolean;
}

const SequenceContext = createContext<SequenceContextValue | null>(null);
const useSequence = () => useContext(SequenceContext);

const ItemIndexContext = createContext<number | null>(null);
const useItemIndex = () => useContext(ItemIndexContext);

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  startOnView?: boolean;
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!sequence || itemIndex === null) return;
    if (!sequence.sequenceStarted) return;
    if (hasStarted) return;
    if (sequence.activeIndex === itemIndex) {
      setHasStarted(true);
    }
  }, [sequence?.activeIndex, sequence?.sequenceStarted, hasStarted, itemIndex]);

  const shouldAnimate = sequence ? hasStarted : startOnView ? isInView : true;

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight wrap-break-word", className)}
      onAnimationComplete={() => {
        if (!sequence || itemIndex === null) return;
        sequence.completeItem(itemIndex);
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface TypingAnimationProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 40,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  
  // Limpieza de children para evitar errores de SSR en Astro
  const textContent = useMemo(() => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.join("");
    return String(children || "");
  }, [children]);

  const MotionComponent = useMemo(
    () => motion.create(Component as any),
    [Component]
  );

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();

  useEffect(() => {
    if (sequence && itemIndex !== null) {
      if (!sequence.sequenceStarted || started) return;
      if (sequence.activeIndex === itemIndex) {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
      }
      return;
    }

    if (!startOnView || isInView) {
      const timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, startOnView, isInView, started, sequence?.activeIndex, sequence?.sequenceStarted, itemIndex]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < textContent.length) {
        setDisplayedText(textContent.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
        if (sequence && itemIndex !== null) {
          sequence.completeItem(itemIndex);
        }
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [textContent, duration, started, sequence, itemIndex]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-sm font-normal tracking-tight wrap-break-word", className)}
      {...props}
    >
      {displayedText}
      {started && displayedText.length < textContent.length && (
        <span className="animate-pulse">|</span>
      )}
    </MotionComponent>
  );
};

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  sequence?: boolean;
  startOnView?: boolean;
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceHasStarted = sequence ? (!startOnView || isInView) : false;

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null;
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) => (index === current ? current + 1 : current));
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    };
  }, [sequence, activeIndex, sequenceHasStarted]);

  const wrappedChildren = useMemo(() => {
    const array = Children.toArray(children).filter(Boolean);
    if (!sequence) return array;
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child}
      </ItemIndexContext.Provider>
    ));
  }, [children, sequence]);

  return (
    <SequenceContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col w-full h-full max-h-[420px] rounded-xl border border-border bg-background/50 backdrop-blur-md text-foreground transition-colors duration-300",
          className
        )}
      >
        {/* Header de Terminal */}
        <div className="flex items-center px-4 py-3 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.2)]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.2)]"></div>
          </div>
          <div className="flex-1 text-center">
             <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest font-bold">Mod0 Session</span>
          </div>
        </div>
        
        {/* Cuerpo de Terminal */}
        <div className="p-4 font-mono overflow-y-auto custom-scrollbar flex-1">
          <div className="grid gap-y-1.5">
            {wrappedChildren}
          </div>
        </div>
      </div>
    </SequenceContext.Provider>
  );
};