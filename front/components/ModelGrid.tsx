import React from "react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import styles from "../styles/Home.module.css";

type Service = {
  id: string | number;
  name: string;
  slug: string;
};

type Photo = {
  photo_url: string;
};

type Model = {
  uuid: string;
  name: string;
  slug: string;
  photos: Photo[];
  price_per_hour?: number;
  boobs?: number;
  place?: string;
  description?: string;
};
export default function ModelGrid({ models }: { models: Model[] }) {
  return (
    <div className={styles.grid}>
      {models.map((model) => (
        <Link
          href={`/models/${model.slug}`}
          key={model.uuid}
          className={styles.cardLink}
        >
          <Card className={`${styles.card} ${styles.hoverCard}`}>
            <CardContent className={styles.cardContent}>
              <div className={styles.imageWrapper}>
                <img
                  src={model.photos[0]?.photo_url || "/no-photo.jpg"}
                  alt={`Фото модели ${model.name}`}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <h3>{model.name}</h3>
                  <p>Цена за час: {model.price_per_hour || "по запросу"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}