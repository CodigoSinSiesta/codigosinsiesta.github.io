import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Documentación Técnica',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Recursos y guías técnicas organizadas y accesibles.
        Encuentra información clara sobre nuestros proyectos y herramientas.
      </>
    ),
  },
  {
    title: 'Blog de Desarrollo',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Artículos sobre desarrollo, mejores prácticas y experiencias del equipo.
        Aprende de nuestros proyectos y comparte conocimiento.
      </>
    ),
  },
  {
    title: 'Proyectos Open Source',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Explora nuestros proyectos en GitHub. Contribuye, aprende
        y colabora con la comunidad de Código Sin Siesta.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
