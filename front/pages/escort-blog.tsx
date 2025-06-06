import MainLayout from "../components/layouts/MainLayout";

const articles = [
  {
    id: 1,
    title: "Как выбрать идеальную эскорт-модель",
    date: "2025-05-20",
    excerpt:
      "Советы по выбору профессиональной и надежной модели, чтобы ваше время прошло идеально.",
    image: "/images/blog/escort-choose.jpg",
  },
  {
    id: 2,
    title: "Безопасность и конфиденциальность: что нужно знать",
    date: "2025-05-15",
    excerpt:
      "Основные правила безопасности для клиентов и моделей, чтобы каждый чувствовал себя комфортно.",
    image: "/images/blog/safety-tips.jpg",
  },
  {
    id: 3,
    title: "Топ-5 трендов в мире эскорта на 2025 год",
    date: "2025-05-10",
    excerpt:
      "Обзор самых актуальных трендов и новинок, которые меняют индустрию эскорта.",
    image: "/images/blog/trends-2025.jpg",
  },
];

export default function BlogPage() {
  return (
    <MainLayout
      title="Эскорт Блог — Новости и Советы"
      description="Читайте наш блог об эскорте: полезные советы, новости, статьи для моделей и клиентов."
    >
      <h1 className="text-3xl font-bold mb-8">Эскорт Блог</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map(({ id, title, date, excerpt, image }) => (
          <article key={id} className="border rounded shadow hover:shadow-lg transition overflow-hidden">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <time className="block text-sm text-gray-500 mb-2">{new Date(date).toLocaleDateString("ru-RU")}</time>
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-gray-700">{excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-12 text-center text-gray-600">Следите за обновлениями — скоро будет ещё больше полезных материалов!</p>
    </MainLayout>
  );
}
