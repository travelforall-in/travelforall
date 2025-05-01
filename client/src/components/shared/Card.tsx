import React from "react";
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

const Card = ({ items }: { items: any[] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {item.label}
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {item.desc}
          </p>
          <Button onClick={() => navigate(item.route)}>
            {item.btnName}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Card;
    