export enum Role {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export type House = {
  id: string;
  city: string;
  rooms: string;
  address: string;
  img: string[];
  price: string;
};
