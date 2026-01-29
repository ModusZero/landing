import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTranslations } from '@/i18n/utils';

// --- Interfaces ---

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  className?: string;
}

export interface MagicBentoProps {
  /** Activa el truncado de texto automático */
  textAutoHide?: boolean;
  /** Habilita partículas flotantes */
  enableStars?: boolean;
  /** Habilita el resplandor global del cursor */
  enableSpotlight?: boolean;
  /** Habilita el borde iluminado */
  enableBorderGlow?: boolean;
  /** Desactiva animaciones */
  disableAnimations?: boolean;
  /** Radio del spotlight */
  spotlightRadius?: number;
  /** Cantidad de partículas */
  particleCount?: number;
  /** Inclinación 3D */
  enableTilt?: boolean;
  /** Efecto de onda al click */
  clickEffect?: boolean;
  /** Atracción magnética */
  enableMagnetism?: boolean;
  /** Array de tarjetas */
  cards: BentoCardProps[];
  /** Función de traducción: (key) => string */
  lang?: "en" | "es";
  /** Color en formato "R, G, B" */
  glowColor?: string;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
export const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

// --- Components ---

/**
 * @example
 * <MagicBento 
 *   cards={myCards}
 *   lang="en"
 *   enableTilt={true}
 *   clickEffect={true}
 *   glowColor="132, 0, 255"
 *   />
 */
const MagicBento: React.FC<MagicBentoProps> = (props) => {
  const {
    cards = [],
    lang = 'en',
    textAutoHide = true,
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    enableTilt = true,
    clickEffect = true,
    enableMagnetism = true,
    glowColor = DEFAULT_GLOW_COLOR
  } = props;

  const t = useTranslations(lang);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detección de móvil para optimizar rendimiento
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lógica Global de MouseMove (Spotlight y Border Glow)
  useEffect(() => {
    if (disableAnimations || isMobile || !enableSpotlight) return;

    const handleGlobalMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const cardsEls = gridRef.current.querySelectorAll('.bento-card-inner');
      
      cardsEls.forEach((card) => {
        const el = card as HTMLElement;
        const rect = el.getBoundingClientRect();
        
        // Calculamos posición relativa para el gradiente del borde
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        el.style.setProperty('--glow-x', `${x}%`);
        el.style.setProperty('--glow-y', `${y}%`);
        
        // Intensidad basada en distancia al centro del spotlight
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const opacity = Math.max(0, 1 - dist / spotlightRadius);
        el.style.setProperty('--glow-opacity', opacity.toString());
      });
    };

    window.addEventListener('mousemove', handleGlobalMove);
    return () => window.removeEventListener('mousemove', handleGlobalMove);
  }, [disableAnimations, isMobile, enableSpotlight, spotlightRadius]);

  // Manejador de eventos por tarjeta (Tilt, Magnetism, Click, Stars)
  const setupCardEvents = (el: HTMLDivElement | null) => {
    if (!el || disableAnimations || isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, {
          rotateX: ((y - centerY) / centerY) * -10,
          rotateY: ((x - centerX) / centerX) * 10,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        gsap.to(el, {
          x: (x - centerX) * 0.1,
          y: (y - centerY) * 0.1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.8)' });
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('div');
      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.className = 'absolute rounded-full pointer-events-none';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: radial-gradient(circle, rgba(${glowColor}, 0.5) 0%, transparent 70%);
        left: ${e.clientX - rect.left}px; top: ${e.clientY - rect.top}px;
        transform: translate(-50%, -50%); z-index: 50;
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, onComplete: () => ripple.remove() });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('click', onClick);
  };

  return (
    <div className="w-full flex justify-center py-10 px-4 bg-black overflow-hidden select-none">
      <style>{`
        .bento-grid-container {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(1, 1fr);
          max-width: 1100px; width: 100%;
        }
        @media (min-width: 640px) { .bento-grid-container { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { 
          .bento-grid-container { grid-template-columns: repeat(4, 1fr); }
          /* Diversidad de tamaños */
          .item-0 { grid-column: span 2; }
          .item-2 { grid-column: span 2; grid-row: span 2; }
          .item-5 { grid-column: span 2; }
        }

        .bento-card-inner {
          position: relative;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          overflow: hidden;
          height: 100%;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          transition: background 0.3s;
        }

        .card--border-glow::after {
          content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
          background: radial-gradient(${spotlightRadius}px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${glowColor}, var(--glow-opacity, 0)), transparent 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude; pointer-events: none; z-index: 2;
        }

        .text-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .text-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div ref={gridRef} className="bento-grid-container">
        {cards.map((card, i) => (
          <div key={i} className={`item-${i} ${card.className || ''}`}>
            <div 
              ref={setupCardEvents}
              className={`bento-card-inner group ${enableBorderGlow ? 'card--border-glow' : ''}`}
              style={{ backgroundColor: card.color }}
            >
              {/* Contenido traducido */}
              <div className="relative z-10 pointer-events-none">
                {card.label && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-tighter text-white/60 mb-3">
                    {t ? t(card.label) : card.label}
                  </span>
                )}
                <h3 className={`text-xl font-bold text-white mb-2 ${textAutoHide ? 'text-clamp-1' : ''}`}>
                  {t ? t(card.title || '') : card.title}
                </h3>
                <p className={`text-sm text-white/40 leading-relaxed ${textAutoHide ? 'text-clamp-2' : ''}`}>
                  {t ? t(card.description || '') : card.description}
                </p>
              </div>

              {/* Efecto de resplandor de fondo interno */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicBento;