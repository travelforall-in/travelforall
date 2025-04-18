import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type PackageData = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedWishlist: PackageData[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(storedWishlist);
      setLoading(false);
    }, 1000); // simulate loading

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id: string) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);

    toast({
      title: 'Removed from wishlist',
      description: 'The item has been removed from your wishlist.',
    });
  };

  const handleMoveToCart = (item: PackageData) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...existingCart, item]));

    handleRemove(item.id);

    toast({
      title: 'Moved to Cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl shadow-md overflow-hidden p-4">
              <Skeleton className="w-full h-48 mb-4 rounded-md" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <p className="text-muted-foreground text-center">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden relative hover:scale-[1.02] transition-transform duration-200"
            >
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
                onClick={() => handleRemove(item.id)}
                title="Remove"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <Button
                  onClick={() => handleMoveToCart(item)}
                  className="mt-4 w-full"
                >
                  Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;


// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast';
// import { useNavigate } from 'react-router-dom';

// interface WishlistItem {
//   id: string;
//   name: string;
//   image: string;
//   description: string;
//   price: number;
// }

// const Wishlist: React.FC = () => {
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const stored = localStorage.getItem('wishlist');
//     if (stored) {
//       setWishlist(JSON.parse(stored));
//     }
//   }, []);

//   const handleRemove = (id: string) => {
//     const updatedWishlist = wishlist.filter(item => item.id !== id);
//     setWishlist(updatedWishlist);
//     localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
//     toast({ title: "Removed from wishlist" });
//   };

//   const handleBuyNow = (item: WishlistItem) => {
//     // Logic to move to payment or cart (extend as needed)
//     toast({
//       title: "Proceeding to checkout",
//       description: `You selected ${item.name}`,
//     });
//     // Navigate to payment page if needed
//     // navigate('/checkout', { state: { item } });
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>
//       {wishlist.length === 0 ? (
//         <p className="text-gray-500">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {wishlist.map(item => (
//             <div key={item.id} className="border rounded-lg shadow p-4">
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-48 object-cover rounded-md mb-4"
//               />
//               <h3 className="text-xl font-semibold">{item.name}</h3>
//               <p className="text-sm text-gray-600 mb-2">{item.description}</p>
//               <p className="text-lg font-medium text-primary mb-4">${item.price}</p>
//               <div className="flex space-x-3">
//                 <Button onClick={() => handleBuyNow(item)}>Buy Now</Button>
//                 <Button variant="destructive" onClick={() => handleRemove(item.id)}>Remove</Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;
