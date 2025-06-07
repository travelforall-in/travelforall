import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { toast } from 'sonner';


const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex justify-center space-x-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
          fill={i < rating ? 'currentColor' : 'none'}
          strokeWidth={1.5}
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

interface FeedbackFormData {
  name: string;
  country: string;
  city: string;
  otherCountry: string;
  otherCity: string;
  image: File | null;
  rating: number;
  testimonial: string;
}

const countryCityMap: Record<string, string[]> = {
  India: ['Mumbai', 'Delhi', 'Bangalore'],
  USA: ['New York', 'Los Angeles', 'Chicago'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane'],
  Other: [],
};

const Testimonials: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    country: '',
    city: '',
    otherCountry: '',
    otherCity: '',
    image: null,
    rating: 5,
    testimonial: '',
  });

  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    document.body.style.overflow = showForm ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showForm]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/feedback')
      .then((res) => {
        console.log('Fetched Testimonials:', res.data);
        setTestimonials(res.data);
      })
      .catch((err) => console.error('Error loading testimonials', err));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append(
      'location',
      formData.country === 'Other'
        ? `${formData.otherCity}, ${formData.otherCountry}`
        : `${formData.city}, ${formData.country}`
    );
    form.append('rating', formData.rating.toString());
    form.append('testimonial', formData.testimonial);
    if (formData.image) form.append('image', formData.image);
    try {
      await axios.post('http://localhost:5000/api/feedback', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Feedback submitted successfully!');

      setFormData({
        name: '',
        country: '',
        city: '',
        otherCountry: '',
        otherCity: '',
        image: null,
        rating: 5,
        testimonial: '',
      });
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');

    }
  };

  const scrollTestimonials = (direction: 'left' | 'right') => {
    const container = document.getElementById('testimonialRow');
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold text-orange-600 mb-4 tracking-wide">
          What Our Travelers Say
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          Real experiences from travelers who’ve explored the world with us.
        </p>

        {/* Carousel Section */}
        <div className="relative">
          <button
            onClick={() => scrollTestimonials('left')}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-orange-100"
            aria-label="Scroll Left"
          >
            ◀
          </button>

          <div
            id="testimonialRow"
            className="flex overflow-x-auto scroll-smooth gap-6 mb-10 px-10 hide-scrollbar"
          >
            {testimonials.length === 0 ? (
              <p className="text-gray-500">No testimonials yet.</p>
            ) : (
              testimonials.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[340px] max-w-sm border p-4 rounded-xl bg-white-50 shadow h-[300px] justify-between"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-orange-400"
                    />
                    <div>
                      <h4 className="font-semibold text-orange-700">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  <RatingStars rating={item.rating} />
                  <p className="mt-2 text-sm text-justify">{item.testimonial}</p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => scrollTestimonials('right')}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-orange-100"
            aria-label="Scroll Right"
          >
            ▶
          </button>
        </div>

        {/* Share Feedback Button */}
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-3 rounded-full text-white font-semibold shadow-xl transition-transform duration-300 hover:scale-105"
          style={{ backgroundColor: 'rgb(249, 115, 22)' }}
        >
          Share Your Experience
        </button>
      </div>

      {/* Feedback Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div
            className="relative bg-white p-6 shadow-2xl w-full max-w-3xl mx-auto overflow-y-auto"
            style={{
              borderRadius: '40px 20px 60px 40px / 60px 60px 20px 40px',
              maxHeight: '80vh',
              minWidth: '500px',
              width: '90vw',
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 text-3xl font-bold text-gray-500 hover:text-red-500 transition"
              aria-label="Close feedback form"
            >
              &times;
            </button>
            <h3 className="text-3xl font-semibold text-center text-orange-600 mb-8 tracking-wide">
              Submit Feedback
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md placeholder:text-black-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                onChange={handleChange}
                value={formData.name}
              />
              <select
                name="country"
                required
                className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                onChange={handleChange}
                value={formData.country}
              >
                <option value="" disabled>
                  Select Country
                </option>
                {Object.keys(countryCityMap).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {formData.country && formData.country !== 'Other' && (
                <select
                  name="city"
                  required
                  className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                  onChange={handleChange}
                  value={formData.city}
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {countryCityMap[formData.country].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              )}

              {formData.country === 'Other' && (
                <>
                  <input
                    type="text"
                    name="otherCountry"
                    placeholder="Enter Country"
                    required
                    className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md placeholder:text-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                    value={formData.otherCountry}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="otherCity"
                    placeholder="Enter City"
                    required
                    className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md placeholder:text-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                    value={formData.otherCity}
                    onChange={handleChange}
                  />
                </>
              )}

              <div className="w-full relative cursor-pointer rounded-2xl border-2 border-dashed border-orange-300 bg-white hover:border-orange-500 transition">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                    alt="Upload"
                    className="w-16 h-16 mb-3 rounded-xl object-cover shadow-lg"
                  />
                  <p className="text-orange-600 font-semibold text-md">
                    Click to upload your adventure photo
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-28 h-28 rounded-full border-4 border-orange-400 shadow-lg mt-4"
                  />
                </div>
              )}

              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                placeholder="Rating (1 to 5)"
                required
                className="w-full px-6 py-3 border border-orange-300 rounded-[40px] shadow-md placeholder:text-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                onChange={handleChange}
                value={formData.rating}
              />

              <textarea
                name="testimonial"
                placeholder="Your feedback matters..."
                required
                className="w-full px-6 py-3 border border-orange-300 rounded-[32px] shadow-md resize-none placeholder:text-black-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
                rows={3}
                onChange={handleChange}
                value={formData.testimonial}
              />

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
