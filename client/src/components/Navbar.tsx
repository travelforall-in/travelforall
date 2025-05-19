import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
}

interface Language {
  code: string;
  name: string;
}

interface Preferences {
  country: string;
  currency: string;
  language: string;
}

interface User {
  firstName: string;
  preferences?: Preferences;
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const navigate = useNavigate();

  const countries: Country[] = [
    { code: 'IN', name: 'India', flag: '/flags/india.png' },
    { code: 'US', name: 'United States', flag: '/flags/usa.png' },
    { code: 'UK', name: 'United Kingdom', flag: '/flags/uk.png' },
  ];

  const currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
  ];

  const languages: Language[] = [
    { code: 'EN', name: 'English' },
    { code: 'HI', name: 'Hindi' },
    { code: 'ES', name: 'Spanish' },
  ];

  const getCurrentCountry = () => countries.find(c => c.code === selectedCountry);
  const getCurrentCurrency = () => currencies.find(c => c.code === selectedCurrency);
  const getCurrentLanguage = () => languages.find(l => l.code === selectedLanguage);

  // Load user and preferences from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPrefs = localStorage.getItem('preferences');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const prefsFromUser = parsedUser.preferences;
        if (prefsFromUser) {
          setSelectedCountry(prefsFromUser.country || 'IN');
          setSelectedCurrency(prefsFromUser.currency || 'INR');
          setSelectedLanguage(prefsFromUser.language || 'EN');
        }
      } catch (error) {
        console.error("Error parsing user or preferences:", error);
      }
    }

    if (storedPrefs) {
      try {
        const prefs = JSON.parse(storedPrefs);
        setSelectedCountry(prefs.country || 'IN');
        setSelectedCurrency(prefs.currency || 'INR');
        setSelectedLanguage(prefs.language || 'EN');
      } catch (error) {
        console.error("Error parsing preferences:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('preferences');
    setUser(null);
    toast({ title: "Logout successful", description: "You have been logged out." });
    navigate('/');
  };

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleApplyPreferences = () => {
    const prefs = {
      country: selectedCountry,
      currency: selectedCurrency,
      language: selectedLanguage,
    };
    localStorage.setItem('preferences', JSON.stringify(prefs));
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <header className={`fixed w-full bg-white/90 backdrop-blur-sm  shadow-sm transition-transform duration-300 ${navbarVisible ? '' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Travell<span className="text-secondary">ForAll</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/all-packages" className="hover:text-primary">Packages</Link>
            <Link to="/destinations" className="hover:text-primary">Destinations</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </nav>

          {/* Preferences Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center space-x-2 border px-3 py-1 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                <img src={getCurrentCountry()?.flag} alt={selectedCountry} className="w-5 h-3.5 rounded-sm object-cover" />
                <span className="text-sm font-medium">{selectedCurrency}</span>
                <span className="text-sm">|</span>
                <span className="text-sm">{getCurrentLanguage()?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-left">Preferences</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Country</label>
                  <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Currency</label>
                  <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>{currency.name} ({currency.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Language</label>
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    {languages.map(language => (
                      <option key={language.code} value={language.code}>{language.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button onClick={handleApplyPreferences}>Apply Preferences</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist"><Button variant="ghost">Wishlist</Button></Link>
            {user ? (

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full bg-primary text-white w-9 h-9 p-0 text-sm font-bold uppercase" variant="ghost">
                    {user?.name?.charAt(0) || "U"}
                  
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <DropdownMenuItem onClick={() => navigate("/account")}>Account</DropdownMenuItem>
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

          <div className="md:hidden flex items-center">
            <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="icon">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1">
          <Link to="/" className="block px-3 py-2 hover:bg-muted rounded">Home</Link>
          <Link to="/all-packages" className="block px-3 py-2 hover:bg-muted rounded">Packages</Link>
          <Link to="/destinations" className="block px-3 py-2 hover:bg-muted rounded">Destinations</Link>
          <Link to="/about" className="block px-3 py-2 hover:bg-muted rounded">About</Link>
          <Link to="/contact" className="block px-3 py-2 hover:bg-muted rounded">Contact</Link>
          {user ? (
            <>
<div className="mt-4 px-3 py-2 text-sm font-semibold text-gray-700 uppercase">
  {user?.name?.charAt(0) || 'A'}
</div>
              <button onClick={() => navigate("/account")} className="block w-full text-left px-3 py-2 hover:bg-muted rounded">Account</button>
              <button onClick={() => navigate("/my-packages")} className="block w-full text-left px-3 py-2 hover:bg-muted rounded">My Packages</button>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-muted rounded text-red-600">Logout</button>
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
