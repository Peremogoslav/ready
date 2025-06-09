import React from "react";
import { GetStaticProps } from "next";
import MainLayout from "../components/layouts/MainLayout";

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
  models: Model[];
};

export default function Home({ models = [] }: HomeProps) {
  const title = "Лучшие эскорт-модели Москвы — проверенные анкеты, фото, цены";
  const description =
    "Лучшие эскорт-модели Москвы — актуальные анкеты с фото, цены, отзывы и услуги. Премиум досуг 24/7.";

  return (
    <MainLayout
      title={title}
      description={description}
      models={models}
    />
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const resModels = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/models/all-model?limit=6&offset=0`
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
      props: { models },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Ошибка:", e);
    return { props: { models: [] } };
  }
};
