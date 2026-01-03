import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import LearningPathRoadmap from './index';
import useProgressTracking from '@site/src/hooks/useProgressTracking';

function LearningPathRoadmapConnected() {
  const { completedModules, toggleModuleComplete, isStorageAvailable } = useProgressTracking();

  return (
    <div>
      {!isStorageAvailable && (
        <div className="alert alert--warning margin-bottom--md">
          Tu progreso no se guardará porque localStorage no está disponible en tu navegador.
        </div>
      )}
      <LearningPathRoadmap
        completedModules={completedModules}
        onToggleComplete={toggleModuleComplete}
      />
    </div>
  );
}

/**
 * Wrapper component that handles client-side only rendering
 * Required because useProgressTracking uses localStorage which is not available during SSR
 */
export default function LearningPathRoadmapWithProgress() {
  return (
    <BrowserOnly fallback={<div className="text--center padding-vert--lg">Cargando mapa de la ruta...</div>}>
      {() => <LearningPathRoadmapConnected />}
    </BrowserOnly>
  );
}
