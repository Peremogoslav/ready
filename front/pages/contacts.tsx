import MainLayout from "../components/layouts/MainLayout";

export default function ContactsPage() {
  return (
    <MainLayout
      title="Контакты — Свяжитесь с нами"
      description="Контакты для связи с администрацией сайта: поддержка, сотрудничество и обратная связь."
    >
      <h1 className="text-3xl font-bold mb-6">Контакты</h1>

      <section className="mb-8">
        <p className="mb-2">
          Если у вас есть вопросы, предложения или хотите сотрудничать, свяжитесь с нами любым удобным способом:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Email: <a href="mailto:info@example.com" className="text-blue-500 underline">info@example.com</a>
          </li>
          <li>
            Телефон: <a href="tel:+79991234567" className="text-blue-500 underline">+7 (999) 123-45-67</a>
          </li>
          <li>Адрес: г. Москва, ул. Примерная, д. 12, офис 34</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Мы на карте</h2>
        <div className="w-full h-64">
          <iframe
            title="Карта расположения офиса"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aexample&source=constructor"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </MainLayout>
  );
}
