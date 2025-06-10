import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import ModelGrid from "../ModelGrid";
import styles from "../../styles/Home.module.css";
import { useServices } from "../../contexts/ServicesContext";
import { Contact } from "../ContactDetails";

type Photo = {
  photo_url: string;
};

type Service = {
  id: string;
  name: string;
  slug: string;
};

type Model = {
  uuid: string;
  name: string;
  slug: string;
  photos: Photo[];
  price_per_hour?: number;
  boobs?: number;
  place?: string;
  description?: string;
};

type Props = {
  title: string;
  description: string;
  seoText?: React.ReactNode;
  models?: Model[];
  children?: React.ReactNode;
  services?: Service[];
};

export default function MainLayout({
  title,
  description,
  seoText,
  models,
  children,
  services: propsServices,
}: Props) {
  const { services: contextServices, loading, error } = useServices();
  const services = propsServices ?? contextServices;

  const [isMobile, setIsMobile] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/all`);
        const data = await res.json();
        setContact(data[0]);
      } catch (err) {
        console.error("Ошибка загрузки контактов:", err);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      setServicesOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>

      <div className={styles.layout}>
        <header className={styles.topText}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <aside className={styles.sidebarLeft}>
            {!isMobile && <h2>Эскорт Услуги:</h2>}

            {isMobile && (
              <button
                className={styles.servicesToggleBtn}
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                aria-controls="services-list"
              >
                Эскорт Услуги {servicesOpen ? "▲" : "▼"}
              </button>
            )}

            <ul
              id="services-list"
              className={`${styles.servicesList} ${
                servicesOpen || !isMobile ? styles.open : ""
              }`}
            >
              {loading && <li>Загрузка услуг...</li>}
              {error && <li>Ошибка загрузки услуг: {error.message}</li>}
              {!loading && !error && (!services || services.length === 0) && (
                <li>Услуги не найдены</li>
              )}
              {!loading &&
                !error &&
                services &&
                services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/services/${service.slug}`}>
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>

          <main className={styles.modelsContainer}>
            {seoText && <div className={styles.seoText}>{seoText}</div>}

            {Array.isArray(models) && models.length > 0 ? (
              <>
                <ModelGrid models={models} />
                {children}
              </>
            ) : (
              children || <p></p>
            )}
          </main>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSections}>
              <div className={styles.footerColumn}>
                <h2>Навигация</h2>
                <ul>
                  <li>
                    <Link href="/">Главная</Link>
                  </li>
                  <li>
                    <Link href="/about">О нас</Link>
                  </li>
                  <li>
                    <Link href="/services">Услуги</Link>
                  </li>
                  <li>
                    <Link href="/contacts">Контакты</Link>
                  </li>
                </ul>
              </div>

              <div className={styles.footerColumn}>
                <h3>Контакты</h3>

                {contact?.global_number && (
                  <p>
                    Телефон:{" "}
                    <a
                      href={`tel:${contact.global_number}`}
                      className="text-blue-500 underline"
                    >
                      {contact.global_number}
                    </a>
                  </p>
                )}

                {contact?.global_telegram && (
                  <p>
                    Telegram:{" "}
                    <a
                      href={`https://t.me/${contact.global_telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      @{contact.global_telegram}
                    </a>
                  </p>
                )}

                {contact?.global_whatsapp && (
                  <p>
                    WhatsApp:{" "}
                    <a
                      href={`https://wa.me/${contact.global_whatsapp.replace(
                        /[^\d]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Написать
                    </a>
                  </p>
                )}
              </div>

              <div className={styles.footerColumn}>
                <h3>Соцсети</h3>

                <ul>
                  <li>
                    <a href="#" target="_blank">
                      Телеграм
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      Ватсап
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.footerBottom}>
              © {new Date().getFullYear()} Сайт. Все права защищены.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
