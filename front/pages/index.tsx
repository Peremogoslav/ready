import React, { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import styles from "../styles/Home.module.css";
import type { GetStaticProps } from 'next';

type Photo = {
  photo_url: string;
};

type Model = {
  uuid: string;
  name: string;
  slug: string;
  place?: string;
  price_per_hour?: number;
  price_per_night?: number;
  price_per_foo?: number;
  boobs?: number;
  description?: string;
  number?: string;
  photos: Photo[];
};

type HomeProps = {
  initialModels: Model[];
};

export default function Home({ initialModels = [] }: HomeProps) {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [offset, setOffset] = useState(initialModels.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/models/all-model?limit=6&offset=${offset}`
      );
      if (res.ok) {
        const newModels: Model[] = await res.json();

        newModels.forEach((model) => {
          if (!model.description) {
            model.description = `Эскорт-модель из ${
              model.place || "не указан"
            }, размер груди ${model.boobs || "не указан"}, цена от ${
              model.price_per_hour || "по запросу"
            }`;
          }
        });

        setModels((prev) => [...prev, ...newModels]);
        setOffset((prev) => prev + newModels.length);

        if (newModels.length < 6) {
          // Если пришло меньше 6 моделей — значит, больше нет
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Ошибка при загрузке моделей:", e);
      setHasMore(false);
    }
    setLoading(false);
  };

  const title = "Лучшие эскорт-модели Москвы — проверенные анкеты, фото, цены";
  const description =
    "Лучшие эскорт-модели Москвы — актуальные анкеты с фото, цены, отзывы и услуги. Премиум досуг 24/7.";

  return (
    <MainLayout title={title} description={description} models={models}>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        {hasMore ? (
<button
  onClick={loadMoreModels}
  disabled={loading}
  className={styles.loadMoreButton}
>
  {loading ? "Загрузка..." : "Показать еще 6 моделей"}
</button>

        ) : (
          <p>Больше моделей нет</p>
        )}
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const resModels = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/models/all-model?limit=12&offset=0`
    );
    const models: Model[] = resModels.ok ? await resModels.json() : [];

    models.forEach((model) => {
      if (!model.description) {
        model.description = `Эскорт-модель из ${
          model.place || "не указан"
        }, размер груди ${model.boobs || "не указан"}, цена от ${
          model.price_per_hour || "по запросу"
        }`;
      }
    });

    return {
      props: { initialModels: models },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Ошибка:", e);
    return { props: { initialModels: [] } };
  }
};
