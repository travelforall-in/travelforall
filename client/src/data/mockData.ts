import { Destination, Package } from '../types/travel';

export const destinations: Destination[] = [
  {
    id: "d1",
    name: "Mountain Retreat",
    type: "domestic",
    category: "Adventure",
    price: 1200,
    image: "https://media.istockphoto.com/id/636215274/photo/people-with-backpacks-and-trekking-sticks-traveling-in-mountains.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zh5I1WT2SKeKZ4MZ64iXLY32o2dVjA9eA_cA-1r9Iw=",
    description: "Experience the thrill of mountain climbing and scenic beauty",
    rating: 4.5
  },
  {
    id: "d2",
    name: "Beach Paradise",
    type: "domestic",
    category: "Honeymoon",
    price: 2500,
    image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9uZXltb29ufGVufDB8fDB8fHww",
    description: "Romantic beachfront getaway with luxury amenities",
    rating: 4.8
  },
  {
    id: "d3",
    name: "Forest Adventure",
    type: "domestic",
    category: "Family",
    price: 1800,
    image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9yZXN0fGVufDB8fDB8fHww",
    description: "Family-friendly forest adventure with activities for all ages",
    rating: 4.3
  },
  // Add more destinations...
];

export const packages: Package[] = [
  {
    id: "p1",
    destinationId: "d1",
    name: "Mountain Explorer Package",
    duration: "5 days",
    price: 1200,
    inclusions: ["Accommodation", "Guided Tours", "Equipment", "Meals"],
    description: "Complete mountain adventure package with expert guides",
    image: "https://media.istockphoto.com/id/636215274/photo/people-with-backpacks-and-trekking-sticks-traveling-in-mountains.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zh5I1WT2SKeKZ4MZ64iXLY32o2dVjA9eA_cA-1r9Iw=",
  },
  {
    id: "p2",
    destinationId: "d2",
    name: "Romantic Getaway",
    duration: "7 days",
    price: 2500,
    inclusions: ["Luxury Resort", "Spa Treatment", "Candlelight Dinner", "Water Activities"],
    description: "Perfect romantic escape for couples",
    image: "https://media.istockphoto.com/id/1125634321/photo/the-couple-greets-the-sunrise-in-the-mountains-man-and-woman-in-the-mountains-wedding-travel.webp?a=1&b=1&s=612x612&w=0&k=20&c=24tlE9PgVF2Bw9n9_II28Yqnr0Y21ZES6oK8xFaBnXc="
  },
  // Add more packages...
];