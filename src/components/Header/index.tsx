import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={`${styles.container} ${commonStyles.containerWidth}`}>
      <img src="/logo.svg" alt="logo" />
    </header>
  );
}
