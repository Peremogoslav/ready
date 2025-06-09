import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useServices } from "../contexts/ServicesContext";

export default function IndiModels() {
  const [models, setModels] = useState([]);
  const { services, loading } = useServices();

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/models/get-by-role?role=elit`, {
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
      title="Инди Модели Москвы — элитный эскорт с индивидуальным подходом"
      description="Эксклюзивные инди модели Москвы — проверенные анкеты с фото, подробным описанием и индивидуальными ценами. Высококлассный приватный сервис для взыскательных клиентов."
      services={services}
      models={models}
    />
  );
}
