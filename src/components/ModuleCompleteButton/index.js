import clsx from 'clsx';
import useProgressTracking from '@site/src/hooks/useProgressTracking';
import styles from './styles.module.css';

/**
 * ModuleCompleteButton - A button component for marking learning modules as complete
 *
 * @param {Object} props
 * @param {string} props.moduleId - The unique identifier for the module (e.g., 'module-1')
 * @param {string} props.nextModuleLink - Optional link to the next module
 * @param {string} props.nextModuleTitle - Optional title of the next module
 */
export default function ModuleCompleteButton({ moduleId, nextModuleLink, nextModuleTitle }) {
  const {
    isModuleComplete,
    toggleModuleComplete,
    isStorageAvailable,
  } = useProgressTracking();

  const isCompleted = isModuleComplete(moduleId);

  const handleClick = () => {
    toggleModuleComplete(moduleId);
  };

  return (
    <div className={styles.container}>
      {!isStorageAvailable && (
        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠️</span>
          <span className={styles.warningText}>
            El almacenamiento local no está disponible. Tu progreso no se guardará.
          </span>
        </div>
      )}

      <div className={styles.buttonWrapper}>
        {isCompleted ? (
          <div className={styles.completedState}>
            <span className={styles.completedBadge}>
              <span className={styles.checkIcon}>✓</span>
              Módulo completado
            </span>
            <button
              type="button"
              className={clsx('button', 'button--secondary', 'button--sm', styles.undoButton)}
              onClick={handleClick}
            >
              Desmarcar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={clsx('button', 'button--success', 'button--lg', styles.completeButton)}
            onClick={handleClick}
          >
            <span className={styles.buttonIcon}>✓</span>
            Marcar como completado
          </button>
        )}
      </div>

      {isCompleted && nextModuleLink && (
        <div className={styles.nextModule}>
          <span className={styles.nextLabel}>Siguiente módulo:</span>
          <a
            href={nextModuleLink}
            className={clsx('button', 'button--primary', 'button--lg', styles.nextButton)}
          >
            {nextModuleTitle || 'Continuar al siguiente módulo'}
            <span className={styles.arrowIcon}>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
