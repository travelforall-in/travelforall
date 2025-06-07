// // pages/TestimonialList.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import TestimonialCard from '../components/TestimonialCard';

// interface Testimonial {
//   _id: string;
//   name: string;
//   location: string;
//   image: string;
//   rating: number;
//   testimonial: string;
// }

// const TestimonialList: React.FC = () => {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       const res = await axios.get('http://localhost:5000/api/feedback');
//       setTestimonials(res.data);
//     };
//     fetchTestimonials();
//   }, []);

//   return (
//     <div className="p-10 flex flex-col gap-6 items-center bg-gray-100 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6">User Testimonials</h2>
//       {testimonials.map((t) => (
//         <TestimonialCard key={t._id} {...t} />
//       ))}
//     </div>
//   );
// };

// export default TestimonialList;
