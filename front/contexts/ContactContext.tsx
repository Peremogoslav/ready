import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Contact {
  id?: number;
  global_telegram: string | null;
  global_whatsapp: string | null;
  global_number: string | null;
}

interface ContactContextType {
  contact: Contact | null;
  loading: boolean;
  error: Error | null;
}

const ContactContext = createContext<ContactContextType>({
  contact: null,
  loading: false,
  error: null,
});

export const useContact = () => useContext(ContactContext);

type Props = { children: ReactNode };

export const ContactProvider = ({ children }: Props) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/all`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data: Contact[] = await res.json();
        setContact(data[0] || null);
      } catch (err) {
        setError(err as Error);
        setContact(null);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  return (
    <ContactContext.Provider value={{ contact, loading, error }}>
      {children}
    </ContactContext.Provider>
  );
};
