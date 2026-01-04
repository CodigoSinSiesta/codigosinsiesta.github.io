import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const ModuleList = [
  {
    id: 'module-1',
    number: 1,
    title: 'Fundamentos de IA',
    duration: '1.5 horas',
    description: 'Qué es un agente de IA, LLMs, APIs, prompting básico',
    link: '/docs/ruta-aprendizaje-ia-agents/01-fundamentos',
    emoji: '🧠',
  },
  {
    id: 'module-2',
    number: 2,
    title: 'TypeScript Esencial',
    duration: '2 horas',
    description: 'Tipos para APIs, zod validation, error handling',
    link: '/docs/ruta-aprendizaje-ia-agents/02-typescript',
    emoji: '📘',
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Conceptos de Agentes',
    duration: '2.5 horas',
    description: 'Tool calling, ReAct pattern, state management',
    link: '/docs/ruta-aprendizaje-ia-agents/03-conceptos',
    emoji: '🤖',
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Agentes Avanzados',
    duration: '3 horas',
    description: 'Prompt engineering, context windows, streaming',
    link: '/docs/ruta-aprendizaje-ia-agents/04-agentes-avanzados',
    emoji: '🚀',
  },
  {
    id: 'module-5',
    number: 5,
    title: 'MCP Servers',
    duration: '2.5 horas',
    description: 'Protocolo MCP, FastMCP, tool schemas',
    link: '/docs/ruta-aprendizaje-ia-agents/05-mcp-servers',
    emoji: '🔌',
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Producción',
    duration: '3 horas',
    description: 'Testing, security, deployment, monitoring',
    link: '/docs/ruta-aprendizaje-ia-agents/06-produccion',
    emoji: '🏭',
  },
];

function ModuleCard({ id, number, title, duration, description, link, emoji, isCompleted, onToggleComplete }) {
  return (
    <div className={clsx(styles.moduleCard, isCompleted && styles.completed)}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleEmoji}>{emoji}</span>
        <span className={styles.moduleNumber}>Módulo {number}</span>
        <span className={styles.moduleDuration}>{duration}</span>
      </div>
      <div className={styles.moduleContent}>
        <Heading as="h3" className={styles.moduleTitle}>
          <Link to={link}>{title}</Link>
        </Heading>
        <p className={styles.moduleDescription}>{description}</p>
      </div>
      <div className={styles.moduleFooter}>
        <Link className={clsx('button', 'button--primary', 'button--sm')} to={link}>
          {isCompleted ? 'Repasar' : 'Comenzar'}
        </Link>
        {isCompleted && (
          <span className={styles.completedBadge}>✓ Completado</span>
        )}
      </div>
    </div>
  );
}

function ProgressArrow() {
  return (
    <div className={styles.progressArrow}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function ProgressSummary({ completedCount, totalCount }) {
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={styles.progressSummary}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={styles.progressText}>
        {completedCount} de {totalCount} módulos completados ({percentage}%)
      </span>
    </div>
  );
}

export default function LearningPathRoadmap({ completedModules = [], onToggleComplete }) {
  const completedSet = new Set(completedModules);
  const completedCount = completedSet.size;

  return (
    <section className={styles.roadmap}>
      <div className="container">
        <div className={styles.roadmapHeader}>
          <Heading as="h2">🗺️ Mapa de la Ruta</Heading>
          <p className={styles.roadmapSubtitle}>
            14.5 horas de contenido estructurado para dominar agentes de IA
          </p>
          <ProgressSummary completedCount={completedCount} totalCount={ModuleList.length} />
        </div>

        <div className={styles.modulesContainer}>
          {ModuleList.map((module, idx) => (
            <div key={module.id} className={styles.moduleWrapper}>
              <ModuleCard
                {...module}
                isCompleted={completedSet.has(module.id)}
                onToggleComplete={onToggleComplete}
              />
              {idx < ModuleList.length - 1 && <ProgressArrow />}
            </div>
          ))}
        </div>

        <div className={styles.roadmapFooter}>
          <p className={styles.footerNote}>
            💡 <strong>Consejo:</strong> Completa cada módulo en orden para mejor comprensión.
            El proyecto práctico de cada módulo refuerza los conceptos aprendidos.
          </p>
        </div>
      </div>
    </section>
  );
}
