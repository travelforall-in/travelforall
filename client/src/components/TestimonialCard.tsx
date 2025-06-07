// // components/TestimonialCard.tsx
// import React from 'react';
// import { Star } from 'lucide-react';

// interface TestimonialCardProps {
//   image: string;
//   name: string;
//   location: string;
//   rating: number;
//   testimonial: string;
// }

// const TestimonialCard: React.FC<TestimonialCardProps> = ({
//   image,
//   name,
//   location,
//   rating,
//   testimonial
// }) => {
//   return (
//     <div className="flex gap-4 bg-white p-6 shadow-lg rounded-xl items-start max-w-3xl">
//       <img
//         src={`/uploads/${image}`}
//         alt={name}
//         className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//       />
//       <div className="flex-1">
//         <div className="flex justify-between">
//           <div>
//             <h3 className="text-xl font-bold">{name}</h3>
//             <p className="text-sm text-gray-500">{location}</p>
//           </div>
//           <div className="flex items-center gap-1">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Star key={i} size={18} color={i <= rating ? "#facc15" : "#d1d5db"} fill={i <= rating ? "#facc15" : "none"} />
//             ))}
//           </div>
//         </div>
//         <p className="mt-3 text-gray-700">{testimonial}</p>
//       </div>
//     </div>
//   );
// };

// export default TestimonialCard;
