import { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";

export default function JobsPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    phone: "",
    email: "",
    about: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить логику отправки формы, например, через API
    setSubmitted(true);
  };

  return (
    <MainLayout
      title="Работа в эскорте — Подать анкету"
      description="Хотите стать эскорт моделью? Узнайте, как подать анкету и начать зарабатывать уже сегодня."
    >
      <h1 className="text-3xl font-bold mb-6">Работа в эскорте</h1>

      <p className="mb-4">
        Мы приглашаем девушек к сотрудничеству в профессиональной и безопасной среде. Если вы хотите начать карьеру в эскорте и получать достойный доход, заполните анкету ниже.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-50 p-6 rounded shadow">
          <label className="block mb-3">
            Имя и Фамилия
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
              placeholder="Введите ваше имя"
            />
          </label>

          <label className="block mb-3">
            Возраст
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              min={18}
              max={50}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Ваш возраст"
            />
          </label>

          <label className="block mb-3">
            Город
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
              placeholder="Где вы проживаете"
            />
          </label>

          <label className="block mb-3">
            Телефон
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
              placeholder="+7 999 999 99 99"
            />
          </label>

          <label className="block mb-3">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="example@mail.com"
            />
          </label>

          <label className="block mb-4">
            Немного о себе
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows={4}
              placeholder="Расскажите о себе, своих интересах"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Отправить анкету
          </button>
        </form>
      ) : (
        <div className="max-w-lg mx-auto bg-green-100 p-6 rounded text-green-800 text-center">
          Спасибо! Ваша анкета успешно отправлена. Мы свяжемся с вами в ближайшее время.
        </div>
      )}
    </MainLayout>
  );
}
