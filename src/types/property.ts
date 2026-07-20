export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  minNights: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  description: string;
  amenities: string[];
  houseRules: string[];
  images: string[];
  address: string;
  checkInNotes?: string;
}

export interface BookingDetails {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  total: number;
}
