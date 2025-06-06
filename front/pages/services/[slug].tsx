import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import MainLayout from "../../components/layouts/MainLayout";
import ModelGrid from "../../components/ModelGrid";
import { useServices } from "../../contexts/ServicesContext";
import type { Model, Service } from "../../types/models";

type Props = {
  service: Service;
};

function generateDescription(serviceName: string) {
  const templates = [
    `Модели, предлагающие услугу "${serviceName}" в Москве — реальные фото, цены и подробные анкеты для вашего выбора.`,
    `Откройте для себя лучших моделей, которые специализируются на услуге "${serviceName}". Проверенные профили и актуальные цены.`,
    `Услуга "${serviceName}" в Москве: широкий выбор моделей с индивидуальными предложениями, фото и отзывами.`,
  ];

  // Случайный выбор шаблона для разнообразия
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

export default function ServicePage({ service }: Props) {
  const router = useRouter();
  const { services, loading } = useServices();

  if (router.isFallback || loading) return <div>Загрузка...</div>;

  return (
    <MainLayout
      title={`Эскорт услуга ${service.name} в Москве`}
      description={generateDescription(service.name)}
      services={services}
    >
      <ModelGrid models={service.models} />
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;

  const serviceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`);

  if (!serviceRes.ok) {
    return {
      notFound: true,
    };
  }

  const service = await serviceRes.json();

  return {
    props: {
      service,
    },
  };
};
