export type Car = {
  id: string;
  name: string;
  categoryId: string | null;
  transmissionTypeId: string | null;
  fuelTypeId: string | null;
  doors: number | null;
  seats: number | null;
  hasAC: boolean;
  pricePerDay: number | string;
  available: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  transmissionType?: {
    id: string;
    name: string;
    createdAt: Date;
  } | null;
  fuelType?: {
    id: string;
    name: string;
    createdAt: Date;
  } | null;
};

export type FilterOptions = {
  categories: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  transmissionTypes: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
  fuelTypes: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
  doorsRange: {
    min: number | null;
    max: number | null;
  };
  seatsRange: {
    min: number | null;
    max: number | null;
  };
};

export type CarFilters = {
  categoryIds?: string[];
  transmissionTypeIds?: string[];
  fuelTypeIds?: string[];
  minDoors?: number;
  maxDoors?: number;
  minSeats?: number;
  maxSeats?: number;
  hasAC?: boolean;
};
