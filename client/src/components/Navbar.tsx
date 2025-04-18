// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, User, Search, Heart, ShoppingBag } from 'lucide-react';
// import { Button } from "@/components/ui/button";

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     alert('Logout Successful');
//     navigate('/');
//   };

//   return (
//     <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <span className="text-2xl font-bold text-primary">Travell<span className="text-secondary">ForAll</span></span>
//             </Link>
//           </div>

//           <nav className="hidden md:flex items-center space-x-6">
//             <Link to="/" className="text-foreground hover:text-primary">Home</Link>
//             <Link to="/packages" className="text-foreground hover:text-primary">Packages</Link>
//             <Link to="/destinations" className="text-foreground hover:text-primary">Destinations</Link>
//             <Link to="/about" className="text-foreground hover:text-primary">About</Link>
//             <Link to="/contact" className="text-foreground hover:text-primary">Contact</Link>
//           </nav>

//           <div className="hidden md:flex items-center space-x-4">
//             <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" asChild>
//               <Link to="/search">
//                 <Search className="h-5 w-5" />
//               </Link>
//             </Button>

//             {user ? (
//               <>
//                 <span className="text-sm font-medium text-gray-700">Hi, {user.firstName}</span>
//                 <Button variant="outline" onClick={handleLogout}>Logout</Button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login"><Button variant="ghost">Login</Button></Link>
//                 <Link to="/signup"><Button>Sign Up</Button></Link>
//               </>
//             )}
//           </div>

//           <div className="md:hidden flex items-center">
//             <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="icon">
//               {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1">
//           <Link to="/" className="block px-3 py-2 hover:bg-muted">Home</Link>
//           <Link to="/packages" className="block px-3 py-2 hover:bg-muted">Packages</Link>
//           <Link to="/destinations" className="block px-3 py-2 hover:bg-muted">Destinations</Link>
//           <Link to="/about" className="block px-3 py-2 hover:bg-muted">About</Link>
//           <Link to="/contact" className="block px-3 py-2 hover:bg-muted">Contact</Link>

//           {user ? (
//             <>
//               <span className="block px-3 py-2 text-gray-700">Hi, {user.firstName}</span>
//               <Button className="ml-3" variant="outline" onClick={handleLogout}>Logout</Button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block px-3 py-2 hover:bg-muted">Login</Link>
//               <Link to="/signup" className="block px-3 py-2 hover:bg-muted">Sign Up</Link>
//             </>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Heart } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [scrollingDown, setScrollingDown] = useState(false); // Detect scroll direction
  const [navbarVisible, setNavbarVisible] = useState(true); // Control navbar visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout successful",
      description: "You have been logged out.",
    });
    navigate('/');
  };

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        setScrollingDown(true);
        setNavbarVisible(false); // Hide navbar on scroll down
      } else {
        setScrollingDown(false);
        setNavbarVisible(true); // Show navbar on scroll up
      }
      setLastScrollY(window.scrollY); // Update last scroll position
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm transition-transform duration-300 ${navbarVisible ? '' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Travell<span className="text-secondary">ForAll</span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary">Home</Link>
            <Link to="/packages" className="text-foreground hover:text-primary">Packages</Link>
            <Link to="/destinations" className="text-foreground hover:text-primary">Destinations</Link>
            <Link to="/about" className="text-foreground hover:text-primary">About</Link>
            <Link to="/contact" className="text-foreground hover:text-primary">Contact</Link>
          </nav>

          {/* Right Side (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist">
    <Button variant="ghost" className="text-foreground hover:text-primary">
      Wishlist
    </Button>
  </Link>


            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full bg-primary text-white w-9 h-9 p-0 text-sm font-bold uppercase"
                    variant="ghost"
                  >
                    {user.firstName.charAt(0)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <DropdownMenuItem onClick={() => navigate("/account")}>Account</DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => navigate("/my-packages")}>My Packages</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                <Link to="/signup"><Button>Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="icon">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1">
          <Link to="/" className="block px-3 py-2 hover:bg-muted rounded">Home</Link>
          <Link to="/packages" className="block px-3 py-2 hover:bg-muted rounded">Packages</Link>
          <Link to="/destinations" className="block px-3 py-2 hover:bg-muted rounded">Destinations</Link>
          <Link to="/about" className="block px-3 py-2 hover:bg-muted rounded">About</Link>
          <Link to="/contact" className="block px-3 py-2 hover:bg-muted rounded">Contact</Link>

          {user ? (
            <>
              <div className="mt-4 px-3 py-2 text-sm font-semibold text-gray-700 uppercase">
                {user.firstName.charAt(0)}
              </div>
              <button
                onClick={() => navigate("/account")}
                className="block w-full text-left px-3 py-2 hover:bg-muted rounded"
              >
                Account
              </button>
              <button
                onClick={() => navigate("/my-packages")}
                className="block w-full text-left px-3 py-2 hover:bg-muted rounded"
              >
                My Packages
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 hover:bg-muted rounded text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 hover:bg-muted rounded">Login</Link>
              <Link to="/signup" className="block px-3 py-2 hover:bg-muted rounded">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
