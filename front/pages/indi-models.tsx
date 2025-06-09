import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useServices } from "../contexts/ServicesContext";

export default function IndiModels() {
  const [models, setModels] = useState([]);
  const { services, loading } = useServices();

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/get-by-role?role=indi`, {
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
      title="Инди Модели Москвы — эксклюзивные анкеты с личным подходом"
      description="Лучшие инди модели Москвы — проверенные анкеты с реальными фото, индивидуальным подходом и прозрачными ценами. Идеальный выбор для приватных и комфортных встреч."
      services={services}
      models={models}
    />
  );
}
