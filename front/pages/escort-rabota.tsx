import { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID!;


export default function JobsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    city: "",
    telegram: "",
    instagram: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const message = `
Имя: ${form.name}
Номер: ${form.phone}
Возраст: ${form.age}
Город: ${form.city}
Телеграм: ${form.telegram}
Инстаграм: ${form.instagram}
    `;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка отправки сообщения в Telegram");
      }

      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    }
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
            Номер
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
            Телеграм
            <input
              type="text"
              name="telegram"
              value={form.telegram}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="@yourtelegram"
            />
          </label>

          <label className="block mb-3">
            Инстаграм
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="@yourinstagram"
            />
          </label>

          {error && (
            <p className="text-red-600 mb-3">{error}</p>
          )}

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
