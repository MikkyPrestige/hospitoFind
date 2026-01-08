import { useTheme } from "@/context/ThemeProvider";
import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './styles/themeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <FiMoon className={styles.icon} />
      ) : (
        <FiSun className={styles.icon} />
      )}
    </button>
  );
};

export default ThemeToggle;