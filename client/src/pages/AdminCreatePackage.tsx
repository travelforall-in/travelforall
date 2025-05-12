import React from 'react';

const AdminCreatePackage: React.FC = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 flex justify-center items-center">
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Click Me
        </button>
      </div>
    </div>
  );
};

export default AdminCreatePackage;
