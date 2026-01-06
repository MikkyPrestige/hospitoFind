import { useTheme } from "@/context/themeContext";
import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './style/themeToggle.module.css';

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