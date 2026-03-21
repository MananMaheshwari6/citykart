export interface City {
  id: string;
  name: string;
  state: string;
  image: string;
  shopCount: number;
}

export interface Shop {
  id: string;
  name: string;
  cityId: string;
  description: string;
  image: string;
  rating: number;
  vendorId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId: string;
  cityId: string;
  rating: number;
  inStock: boolean;
}

