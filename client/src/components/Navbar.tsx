import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Heart, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
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
    alert('Logout Successful');
    navigate('/');
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Travell<span className="text-secondary">ForAll</span></span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary">Home</Link>
            <Link to="/packages" className="text-foreground hover:text-primary">Packages</Link>
            <Link to="/destinations" className="text-foreground hover:text-primary">Destinations</Link>
            <Link to="/about" className="text-foreground hover:text-primary">About</Link>
            <Link to="/contact" className="text-foreground hover:text-primary">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">Hi, {user.firstName}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                <Link to="/signup"><Button>Sign Up</Button></Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="icon">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1">
          <Link to="/" className="block px-3 py-2 hover:bg-muted">Home</Link>
          <Link to="/packages" className="block px-3 py-2 hover:bg-muted">Packages</Link>
          <Link to="/destinations" className="block px-3 py-2 hover:bg-muted">Destinations</Link>
          <Link to="/about" className="block px-3 py-2 hover:bg-muted">About</Link>
          <Link to="/contact" className="block px-3 py-2 hover:bg-muted">Contact</Link>

          {user ? (
            <>
              <span className="block px-3 py-2 text-gray-700">Hi, {user.firstName}</span>
              <Button className="ml-3" variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 hover:bg-muted">Login</Link>
              <Link to="/signup" className="block px-3 py-2 hover:bg-muted">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
