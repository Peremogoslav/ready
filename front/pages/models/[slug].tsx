import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ModelPage.module.css";
import type { Model, Service } from "../../types/models";

type ModelPageProps = {
  model: Model;
  otherModels: Model[];
};

function generateDescription(model: Model): string {
  let desc = model.description?.trim();

  if (!desc || desc.length < 30) {
    desc = `Эскорт модель ${model.name}`;

    if (model.place) desc += ` из ${model.place}`;

    if (model.price_per_hour) desc += `, цена от ${model.price_per_hour} за час`;

    if (model.services && model.services.length > 0) {
      const servicesList = model.services.map(s => s.name).join(", ");
      desc += `. Услуги - ${servicesList}`;
    }
  }

  // Ограничим длину description до ~160 символов
  if (desc.length > 160) {
    desc = desc.slice(0, 157) + "...";
  }

  return desc;
}

function formatPrice(price?: string): string {
  if (!price) return "";
  return price.includes("₽") ? price : `${price} ₽`;
}

function generateTitle(model: Model): string {
  const parts = [];

  if (model.name) parts.push(model.name);
  parts.push("эскорт модель");

  if (model.place) parts.push(model.place);

  if (model.price_per_hour) parts.push(`от ${model.price_per_hour} за час`);

  if (model.boobs) parts.push(`${model.boobs} размер груди`);

  return parts.filter(Boolean).join(", ");
}

const cityCases: Record<string, string> = {
  "Москва": "в Москве",
  "Санкт-Петербург": "в Санкт-Петербурге",
  "Казань": "в Казани",
  "Новосибирск": "в Новосибирске",
  "Екатеринбург": "в Екатеринбурге",
  "Сочи": "в Сочи",
  "Краснодар": "в Краснодаре",
  "Уфа": "в Уфе",
  "Омск": "в Омске",

}

function getCityInPrepositional(city?: string): string {
  if (!city) return "";
  return cityCases[city] || `в ${city}`;
}

export default function ModelPage({ model, otherModels }: ModelPageProps) {
  const router = useRouter();

  if (router.isFallback) return <div className={styles.container}>Loading...</div>;
  if (!model) return <div className={styles.container}>Model not found</div>;

  const formatPrice = (price?: string) => {
    if (!price) return "по запросу";
    return price.includes('₽') ? price : `${price} ₽`;
  };

  return (
    <>
      <Head>
        <title>{generateTitle(model)}</title>
        <meta name="description" content={generateDescription(model)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← Назад
          </button>

          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              {model.name} — эскорт модель {getCityInPrepositional(model.place)} от {formatPrice(model.price_per_hour)} / час
            </h1>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <div className={styles.photosSection}>
              <h2 className={styles.photosTitle}>Фотографии</h2>
              <div className={styles.photos}>
                {Array.isArray(model.photos) && model.photos.length > 0 ? (
                  model.photos.slice(0, 6).map((photo, i) => (
                    <img
                      key={i}
                      src={photo.photo_url}
                      alt={`${model.name} ${i + 1}`}
                      className={styles.photo}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ))
                ) : (
                  <img src="/no-photo.jpg" alt={model.name} className={styles.photo} />
                )}
              </div>
            </div>

            <div className={styles.socialButtons}>
                <a
                  href={`https://t.me/${model.number || 'contact'}`}
                  className={`${styles.socialButton} ${styles.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в Telegram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.44c-.12.54-.43.67-.87.42l-2.4-1.77-1.16 1.12c-.13.13-.24.24-.49.24l.17-2.43 4.5-4.07c.2-.18-.04-.27-.3-.1l-5.56 3.5-2.4-.75c-.52-.16-.53-.52.11-.77l9.38-3.61c.43-.16.81.1.67.77z"/>
                  </svg>
                  <span>Написать в Telegram</span>
                </a>
                <a
                  href={`https://wa.me/${model.number?.replace(/[^\d]/g, '') || '79999999999'}`}
                  className={`${styles.socialButton} ${styles.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.506"/>
                  </svg>
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            <div className={styles.details}>
              <div className={styles.detailsColumn}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Цена за час</div>
                  <div className={`${styles.detailValue} ${styles.priceTag}`}>
                    {formatPrice(model.price_per_hour)}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Цена за 4 часа</div>
                  <div className={`${styles.detailValue} ${styles.priceTag}`}>
                    {formatPrice(model.price_per_foo)}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Цена за ночь</div>
                  <div className={`${styles.detailValue} ${styles.priceTag}`}>
                    {formatPrice(model.price_per_night)}
                  </div>
                </div>

                {model.number && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Контакт</div>
                    <div className={styles.detailValue}>{model.number}</div>
                  </div>
                )}
              </div>

              <div className={styles.detailsColumn}>
                {model.boobs && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Размер</div>
                    <div className={styles.detailValue}>{model.boobs}</div>
                  </div>
                )}

                {model.description && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>О себе</div>
                    <div className={styles.detailValue}>{model.description}</div>
                  </div>
                )}

                {model.services && model.services.length > 0 && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Услуги</div>
                    <div className={styles.servicesContainer}>
                      {model.services.map((service, index) => (
                        <span key={index} className={styles.serviceTag}>
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Другие модели</h2>
            {otherModels.length > 0 ? (
              otherModels.slice(0, 4).map((m) => (
                <div
                  key={m.uuid}
                  className={styles.sidebarItem}
                  onClick={() => router.push(`/models/${m.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") router.push(`/models/${m.slug}`);
                  }}
                >
                  <img
                    src={m.photos?.[0]?.photo_url || "/no-photo.jpg"}
                    alt={m.name}
                    className={styles.sidebarPhoto}
                    loading="lazy"
                  />
                  <h3>{m.name}</h3>
                </div>
              ))
            ) : (
              <p style={{color: '#999', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center'}}>
                Нет других моделей
              </p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/all-model?limit=10`);
  const data = await res.json();

  const models = Array.isArray(data) ? data : data.models || data.data || [];

  const paths = models.map((model) => ({
    params: { slug: `${model.slug}` },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugWithPrefix = params?.slug as string;
  const slug = slugWithPrefix.replace(/^model-/, "");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/${slug}`);

  if (res.status !== 200) {
    return { notFound: true };
  }

  const model: Model = await res.json();

  if (!Array.isArray(model.photos)) {
    model.photos = model.photos ? [model.photos as any] : [];
  }

const resOthers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/random?count=5`);
let otherModels: Model[] = [];

if (resOthers.ok) {
  otherModels = await resOthers.json();
}


  return {
    props: { model, otherModels },
    revalidate: 60,
  };
};
