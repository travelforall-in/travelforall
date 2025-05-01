export interface Destination {
    id: string;
    name: string;
    type: 'domestic' | 'international';
    category: 'Student'|'Adventure' | 'Honeymoon' | 'Family' | 'Solo' | 'Group' | 'Corporate';
    price: number;
    image: string;
    description: string;
    rating: number;
  }
  
  export interface Package {
    id: string;
    destinationId: string;
    name: string;
    duration: string;
    price: number;
    inclusions: string[];
    description: string;
    image: string;
  }
  
  export interface BookingDetails {
    name: string;
    email: string;
    travelers: number;
    travelDate: string;
    packageId: string;
  }
  
  export type CategoryFilter = 'Student' |'Adventure' | 'Honeymoon' | 'Family' | 'Solo' | 'Group' | 'Corporate' | 'All';