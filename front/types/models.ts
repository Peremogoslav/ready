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
  price_per_hour?: string;
  price_per_night?: string;
  price_per_foo?: string;
  boobs?: string;
  description?: string;
  number?: string;
  photos: Photo[];
  services?: Service[];
};