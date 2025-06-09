import { useEffect, useState } from "react";

export interface Contact {
  id: number;
  global_telegram: string | null;
  global_whatsapp: string | null;
  global_number: string | null;
}

export default function ContactDetails() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/all`)
      .then((res) => res.json())
      .then((data) => {
        setContact(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке контактов:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка контактов...</p>;
  if (!contact) return <p>Контакты не найдены.</p>;

  return (
    <ul className="list-disc pl-5 space-y-2">
      {contact.global_number && (
        <li>
          Телефон:{" "}
          <a href={`tel:${contact.global_number}`} className="text-blue-500 underline">
            {contact.global_number}
          </a>
        </li>
      )}
      {contact.global_telegram && (
        <li>
          Telegram:{" "}
          <a href={`https://t.me/${contact.global_telegram}`} className="text-blue-500 underline">
            @{contact.global_telegram}
          </a>
        </li>
      )}
      {contact.global_whatsapp && (
        <li>
          WhatsApp:{" "}
          <a
            href={`https://wa.me/${contact.global_whatsapp.replace(/[^\d]/g, "")}`}
            className="text-blue-500 underline"
          >
            Написать в WhatsApp
          </a>
        </li>
      )}
    </ul>
  );
}
