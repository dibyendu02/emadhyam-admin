interface Product {
  _id?: string;
  name: string;
  imageUrls: string[];
  category: string | { _id: string; name: string };
  season: string;
  color: string | { _id: string; name: string };
  shortDescription: string;
  description: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discountPercentage: number;
  sizeRanges: string[];
  inStock: boolean;
  reviews: number;
  productType: string;
  plantType: string;
  isBestseller: boolean;
  isTrending: boolean;
  weight: string;
  dimensions: string;
  waterRequirement: string;
  sunlightRequirement: string;
  faqs: Array<{ question: string; answer: string }>;
}

interface Category {
  _id: string;
  name: string;
}

interface Color {
  _id: string;
  name: string;
}
