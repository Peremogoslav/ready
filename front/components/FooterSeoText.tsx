import React from "react";
import styles from "../styles/Footer.module.css";

type FooterSeoTextProps = {
  text: string | React.ReactNode;
};

export default function FooterSeoText({ text }: FooterSeoTextProps) {
  return <footer className={styles.footerSeo}>{text}</footer>;
}
