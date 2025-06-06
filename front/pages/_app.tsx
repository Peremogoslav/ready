import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Header } from "../components/Header";
import { ServicesProvider } from "../contexts/ServicesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ServicesProvider>
      <Header />
      <Component {...pageProps} />
    </ServicesProvider>
  );
}
