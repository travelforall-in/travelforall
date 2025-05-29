// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { Link } from 'react-router-dom';
// import { getHomePath } from '../utils/getHomePath'; // adjust if needed

// interface FormData {
//   name: string;
//   email: string;
//   message: string;
// }

// const ContactUs: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     alert('Message sent! We will get back to you shortly.');
//     setFormData({ name: '', email: '', message: '' });
//   };

//   return (
//     <section className="bg-background py-16 text-foreground font-sans">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold text-secondary mb-6">Contact Us</h1>
//         <p className="text-gray-600 mb-10">
//           We'd love to hear from you! Whether you have a question about a destination, need help planning, or just want to say hello, our team is here to assist.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           {/* Contact Info */}
//           <div className="border-l-4 border-secondary pl-4">
//             <h2 className="text-2xl font-semibold text-secondary mb-4">Our Office</h2>
//             <p className="mb-2">📍 Pune, Maharashtra, India</p>
//             <p className="mb-2">📧 support@travelforall.com</p>
//             <p className="mb-2">📞 +91 98765 43210</p>

//             <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Working Hours</h3>
//             <p>Monday to Saturday: 9 AM - 6 PM</p>
//           </div>

//           {/* Contact Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block font-medium mb-1 text-primary">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-primary">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-primary">Message</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 required
//                 rows={5}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="bg-secondary text-secondary-foreground font-semibold px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-12">
//           <Link
//             to={getHomePath()}
//             className="inline-block bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-lg shadow transition-all"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactUs;


import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getHomePath } from '../utils/getHomePath'; // adjust if needed

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccessMessage('Message sent! We will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background py-16 text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-secondary mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-10">
          We'd love to hear from you! Whether you have a question about a destination, need help planning, or just want to say hello, our team is here to assist.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="border-l-4 border-secondary pl-4">
            <h2 className="text-2xl font-semibold text-secondary mb-4">Our Office</h2>
            <p className="mb-2">📍 Pune, Maharashtra, India</p>
            <p className="mb-2">📧 support@travelforall.com</p>
            <p className="mb-2">📞 +91 98765 43210</p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Working Hours</h3>
            <p>Monday to Saturday: 9 AM - 6 PM</p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block font-medium mb-1 text-primary">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={loading}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`font-semibold px-6 py-2 rounded-lg transition-all ${
                loading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-white'
              }`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-12">
          <Link
            to={getHomePath()}
            className="inline-block bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-lg shadow transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

