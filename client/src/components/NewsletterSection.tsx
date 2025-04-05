
// import React from 'react';
// import { Send } from 'lucide-react';
// import { Button } from "@/components/ui/button";

// const NewsletterSection = () => {
//   return (
//     <section className="py-16 bg-primary text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-4">Get Exclusive Travel Offers</h2>
//           <p className="text-white/90 mb-8">
//             Subscribe to our newsletter and receive personalized travel deals, insider tips, and inspiration for your next adventure.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-grow px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
//             />
//             <Button className="bg-secondary hover:bg-secondary/90 text-white font-medium px-6">
//               <Send className="h-4 w-4 mr-2" />
//               Subscribe
//             </Button>
//           </div>
          
//           <p className="mt-4 text-sm text-white/70">
//             By subscribing, you agree to our Privacy Policy and consent to receive travel-related emails.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterSection;

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Exclusive Travel Offers</h2>
          <p className="text-white/90 mb-8">
            Subscribe to our newsletter and receive personalized travel deals, insider tips, and inspiration for your next adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Button
              className="bg-secondary hover:bg-secondary/90 text-white font-medium px-6"
              onClick={handleSubscribe}
            >
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>

          {status && (
            <p className="mt-4 text-sm text-white/70">
              {status}
            </p>
          )}

          <p className="mt-4 text-sm text-white/70">
            By subscribing, you agree to our Privacy Policy and consent to receive travel-related emails.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
