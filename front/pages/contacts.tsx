import MainLayout from "../components/layouts/MainLayout";
import ContactDetails from "../components/ContactDetails";

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

        <ContactDetails />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Мы на карте</h2>
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            title="Карта расположения офиса"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aexample&source=constructor"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </MainLayout>
  );
}
