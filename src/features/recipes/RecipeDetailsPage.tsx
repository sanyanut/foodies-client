import React from "react";
import { useParams } from "react-router-dom";

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Recipe Details</h1>
      <p className="text-gray-600">Recipe ID: {id}</p>
    </main>
  );
};

export default RecipeDetailsPage;
