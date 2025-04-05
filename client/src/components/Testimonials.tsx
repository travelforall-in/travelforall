
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emma Thompson',
    location: 'London, UK',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    testimonial: "Our family trip to Greece was absolutely perfect! TravellForAll took care of every detail, from hotel bookings to local guides. Couldn't have asked for a better experience.",
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Vancouver, Canada',
    image: 'https://randomuser.me/api/portraits/men/92.jpg',
    rating: 5,
    testimonial: "The Japan cultural tour exceeded all my expectations. The itinerary was perfectly balanced between historical sites and modern attractions. I'll definitely book with them again.",
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    location: 'Sydney, Australia',
    image: 'https://randomuser.me/api/portraits/women/46.jpg',
    rating: 4,
    testimonial: "Bali was magical! The accommodations were luxurious, and our guide was knowledgeable and friendly. Only reason for 4 stars is I wish we had one more day at the beach.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Travelers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from travelers who've explored the world with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-600 italic">{testimonial.testimonial}</blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
