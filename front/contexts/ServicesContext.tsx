import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Service = {
  id: string;
  name: string;
  slug: string;
};

type ServicesContextType = {
  services: Service[];
  loading: boolean;
  error: Error | null;
};

const ServicesContext = createContext<ServicesContextType>({
  services: [],
  loading: false,
  error: null,
});

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/all-services`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    })
    .then((data) => setServices(data))
    .catch(setError)
    .finally(() => setLoading(false));
}, []);


  return (
    <ServicesContext.Provider value={{ services, loading, error }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => useContext(ServicesContext);
