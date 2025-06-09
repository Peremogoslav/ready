import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

type Contact = {
  global_telegram: string | null;
  global_whatsapp: string | null;
  global_number: string | null;
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/all`);
        const data = await res.json();
        setContact(data[0]);
      } catch (error) {
        console.error("Ошибка загрузки контактов:", error);
      }
    }

    fetchContacts();
  }, []);

  // Формируем ссылки с проверками
  const telegramLink = contact?.global_telegram
    ? `https://t.me/${contact.global_telegram}`
    : "#";

  const whatsappLink = contact?.global_whatsapp
    ? `https://wa.me/${contact.global_whatsapp.replace(/[^\d]/g, "")}`
    : "#";

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
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <FaTelegramPlane className={styles.icon} />
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className={styles.icon} />
        </a>
      </div>

      <div className={styles.mobileIcons}>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <FaTelegramPlane className={styles.icon} />
        </a>
        <a
          href={whatsappLink}
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
