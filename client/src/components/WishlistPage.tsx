// import React, { useEffect, useState } from 'react';
// import { X } from 'lucide-react';
// import { toast } from '@/components/ui/use-toast';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';

// type PackageData = {
//   _id: string;
//   name: string;
//   description: string;
//   image: string;
// };

// const WishlistPage: React.FC = () => {
//   const [wishlist, setWishlist] = useState<PackageData[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   const fetchWishlist = async () => {
//     try {
//       const res = await fetch('/api/wishlist');
//       const data = await res.json();
//       setWishlist(data);
//     } catch (error) {
//       console.error('Failed to fetch wishlist:', error);
//       toast({ title: 'Error', description: 'Could not load wishlist' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (id: string) => {
//     try {
//       await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
//       setWishlist(wishlist.filter((item) => item._id !== id));

//       toast({
//         title: 'Removed from Wishlist',
//         description: 'The item has been removed from your wishlist.',
//       });
//     } catch (error) {
//       toast({ title: 'Error', description: 'Failed to remove item' });
//     }
//   };

//   const handleMoveToCart = async (item: PackageData) => {
//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(item),
//       });

//       if (res.ok) {
//         await handleRemove(item._id); // Remove from wishlist
//         toast({
//           title: 'Moved to Cart',
//           description: `${item.name} has been added to your cart.`,
//         });
//       } else {
//         const { message } = await res.json();
//         toast({
//           title: 'Already in Cart',
//           description: message || `${item.name} is already in your cart.`,
//         });
//       }
//     } catch (error) {
//       toast({ title: 'Error', description: 'Failed to move item to cart' });
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="rounded-xl shadow-md overflow-hidden p-4">
//               <Skeleton className="w-full h-48 mb-4 rounded-md" />
//               <Skeleton className="h-6 w-3/4 mb-2" />
//               <Skeleton className="h-4 w-full mb-1" />
//               <Skeleton className="h-4 w-5/6" />
//             </div>
//           ))}
//         </div>
//       ) : wishlist.length === 0 ? (
//         <p className="text-muted-foreground text-center">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {wishlist.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden relative hover:scale-[1.02] transition-transform duration-200"
//             >
//               <button
//                 className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
//                 onClick={() => handleRemove(item._id)}
//                 title="Remove"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="text-xl font-semibold">{item.name}</h2>
//                 <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
//                 <Button
//                   onClick={() => handleMoveToCart(item)}
//                   className="mt-4 w-full"
//                 >
//                   Move to Cart
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;


// 







import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { commonService } from '@/service/commonService'; // Ensure path is correct

type PackageData = {
  _id: string;
  name: string;
  description: string;
  image: string;
};

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem("user");
      let userId;

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser?._id || parsedUser?.id;
        } catch (e) {
          console.error("Failed to parse user from localStorage");
        }
      }

      if (!userId) {
        throw new Error("User ID not found in localStorage.");
      }

      console.log("Token:", token);
      console.log("User ID:", userId);

      const response = await commonService.getAll<{ packages: PackageData[] }>(
        'wishlist',
        { userId },
        token
      );

      setWishlist(response.data.packages || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wishlist.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await commonService.deleteItem('wishlist', id, token);
      toast({
        title: 'Removed from Wishlist',
        description: 'The item has been removed from your wishlist.',
      });
      fetchWishlist();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      });
    }
  };

  const handleMoveToCart = async (item: PackageData) => {
    try {
      const existingCart: PackageData[] = JSON.parse(localStorage.getItem('cart') || '[]');

      const isAlreadyInCart = existingCart.some((pkg) => pkg._id === item._id);
      if (!isAlreadyInCart) {
        localStorage.setItem('cart', JSON.stringify([...existingCart, item]));
        toast({
          title: 'Moved to Cart',
          description: `${item.name} has been added to your cart.`,
        });
      } else {
        toast({
          title: 'Already in Cart',
          description: `${item.name} is already in your cart.`,
        });
      }

      await handleRemove(item._id);
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
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
              key={item._id}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden relative hover:scale-[1.02] transition-transform duration-200"
            >
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
                onClick={() => handleRemove(item._id)}
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
