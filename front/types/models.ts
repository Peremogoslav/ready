export type Photo = {
  photo_url: string;
};

export type Service = {
  name: string;
  slug?: string;
  models?: Model[];
};

export type Model = {
  uuid: string;
  name: string;
  slug: string;
  place?: string;
  price_per_hour?: number;
  price_per_night?: number;
  price_per_foo?: number;
  boobs?: number;
  description?: string;
  number?: string;
  photos: Photo[];
  services?: Service[];
};