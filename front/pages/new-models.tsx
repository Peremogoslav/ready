import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useServices } from "../contexts/ServicesContext";

export default function NewModels() {
  const [models, setModels] = useState([]);
  const { services, loading } = useServices();

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/get-by-role?role=new`, {
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      })
        .then((res) => {
          return res.json();
        })
        .then(setModels)
        .catch((err) => {
          console.error("Ошибка загрузки моделей:", err);
          setModels([]);
        });
    }
  }, []);

  if (loading) return <div>Загрузка сервисов...</div>;

  return (
    <MainLayout
      title="Новые эскорт-модели Москвы — свежие анкеты и уникальные предложения"
      description="Откройте для себя новые лица Москвы — свежие анкеты эскорт-моделей с реальными фото, актуальными ценами и подробным описанием услуг. Идеальный выбор для тех, кто ищет что-то новое и эксклюзивное."
      services={services}
      models={models}
    />
  );
}
