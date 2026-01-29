import type { FeaturesConfig } from "@/types/features-config";

export const MOD0_FEATURES: FeaturesConfig = {
    title: 'Precision Core Features',
    subtitle:
    'The first autonomous environment equipped with real-time reasoning visualization and agentic orchestration.',
    items: [
        {
          icon: 'zap',
          title: 'Thinking Graph Visualizer',
          description:
            'Observe the real-time reasoning path of your agents. Monitor every decision, branch, and logic path in a live interactive graph.',
        },
        {
          icon: 'layers',
          title: 'Agentic Kanban Board',
          description:
            'Manage autonomous workflows with a specialized Kanban. Assign tasks to agent clusters and monitor execution progress in parallel.',
        },
        {
          icon: 'code',
          title: 'Native Code Generation',
          description:
            'Agents write, refactor, and deploy code directly into your repositories with technical precision and zero-supervision mode.',
        },
        {
          icon: 'cpu-chip',
          title: 'Neural Logic Engine',
          description:
            'Our proprietary inference layer ensures agents respond and execute complex reasoning in near real-time with low latency.',
        },
        {
          icon: 'shield-check',
          title: 'Hardened Sandbox',
          description:
            'Execute agentic tasks in isolated, secure environments. Bank-level encryption and SOC 2 compliance for your data privacy.',
        },
        {
          icon: 'github',
          title: 'GitHub Core Sync',
          description:
            'Deep integration with your repositories. Agents understand your technical debt, project history, and code standards.',
        },
        {
          icon: 'wrench',
          title: 'Autonomous Self-Healing',
          description:
            'Automated debugging and error correction. When a process fails, agents identify the root cause and apply an autonomous patch.',
        },
        {
          icon: 'chart', 
          title: 'Performance Analytics',
          description:
            'Full traceability of every thought and token spent. Visualize success rates and optimize your agentic workflows with ease.',
        },
        {
          icon: 'lightning',
          title: 'Multi-Agent Swarms',
          description:
            'Coordinate multiple specialized agents working together. Scale from one to hundreds of instances instantly without overhead.',
        },
    ],
};