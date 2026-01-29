import type { FutureNewsConfig } from '@/types/future-news-config';

export const MOD0_FUTURE_NEWS: FutureNewsConfig = {
  title: 'Próximamente en Mod0',
  subtitle: 'La hoja de ruta de nuestra IA',
  items: [
    { 
      label: 'Video Generation', 
      title: 'Video Generation', 
      description: 'Crea clips autónomos desde prompts de alta fidelidad.',
      color: '#1e1b4b' // Indigo Profundo (Crea enfoque y seriedad)
    },
    { 
      label: 'API v2', 
      title: 'API v2', 
      description: 'Integración profunda y optimizada para desarrolladores.',
      color: '#0f172a' // Slate Oscuro (Neutro y técnico)
    },
    { 
        label: 'Q3 2026', 
        title: 'Multi-Modal Voice', 
        description: 'Conversaciones con latencia cero y detección de emociones naturales.',
        color: '#312e81' // Azul Eléctrico apagado (Asociado a la comunicación)
    },
    { 
        label: 'Research', 
        title: 'Neural Templates', 
        description: 'Capacidad de aprendizaje asociativo para diseño arquitectónico avanzado.',
        color: '#4c1d95' // Púrpura Real (Asociado a la creatividad e inteligencia)
    },
    { 
        label: 'Enterprise', 
        title: 'Local Nodes', 
        description: 'Privacidad total ejecutando Mod0 en tu propia infraestructura.',
        color: '#064e3b' // Verde Esmeralda Oscuro (Seguridad y estabilidad)
    },
    { 
        label: 'Community', 
        title: 'Open Marketplace', 
        description: 'Comparte y monetiza tus propios modelos personalizados.',
        color: '#451a03' // Ámbar/Marrón Quemado (Calidez humana y comunidad)
    }
  ]
};