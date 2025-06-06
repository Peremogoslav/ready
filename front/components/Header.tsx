import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          MySite
        </Link>
        <button
          className={styles.burger}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          type="button"
        >
          &#9776;
        </button>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <div className={styles.navGroup}>
          <Link href="/" className={styles.link} onClick={closeMenu}>
            Все Модели
          </Link>
          <Link href="/elit-models" className={styles.link} onClick={closeMenu}>
            Элитные
          </Link>
          <Link href="/new-models" className={styles.link} onClick={closeMenu}>
            Новые
          </Link>
          <Link href="/indi-models" className={styles.link} onClick={closeMenu}>
            Индивидуалки
          </Link>
        </div>

        <div className={styles.navGroup}>
          <Link href="/escort-blog" className={styles.link} onClick={closeMenu}>
            Эскорт Блог
          </Link>
          <Link href="/escort-rabota" className={styles.link} onClick={closeMenu}>
            Эскорт Работа
          </Link>
          <Link href="/contacts" className={styles.link} onClick={closeMenu}>
            Контакты
          </Link>
          <Link href="/about" className={styles.link} onClick={closeMenu}>
            О нас
          </Link>
        </div>
      </nav>

      {/* Десктопные иконки */}
      <div className={styles.right}>
        <a
          href="https://t.me/..."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <FaTelegramPlane className={styles.icon} />
        </a>
        <a
          href="https://wa.me/..."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className={styles.icon} />
        </a>
      </div>

      {/* Мобильные иконки — показываем только на мобиле */}
      <div className={styles.mobileIcons}>
        <a
          href="https://t.me/..."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <FaTelegramPlane className={styles.icon} />
        </a>
        <a
          href="https://wa.me/..."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className={styles.icon} />
        </a>
      </div>
    </header>
  );
}
