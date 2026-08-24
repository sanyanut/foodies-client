import React from "react";
import { useParams } from "react-router-dom";

const mockIngredients = [
  { id: 1, name: "Salmon", amount: "400 g" },
  { id: 2, name: "Avocado", amount: "3" },
  { id: 3, name: "Cucumber", amount: "1" },
  { id: 4, name: "Spinach", amount: "400 g" },
  { id: 5, name: "Mint", amount: "4 tbs" },
  { id: 6, name: "Lime", amount: "1" },
  { id: 7, name: "Honey", amount: "2 tsp" },
  { id: 8, name: "Olive oil", amount: "3 tbs" },
];

const popularRecipes = [
  {
    id: 1,
    title: "FLAMICHE",
    author: "Ivetta",
    desc: "For the pastry, sift the flour and salt into the bowl of a food processor, add the but...",
  },
  {
    id: 2,
    title: "BEEF WELLINGTON",
    author: "Victor",
    desc: "Put the mushrooms into a food processor with some seasoning and pulse to a roug...",
  },
  {
    id: 3,
    title: "TUNA NICOISE",
    author: "Nadia",
    desc: "Heat oven to 200C/fan 180C/gas 6. Toss the potatoes with 2 tsp oil and some sea...",
  },
  {
    id: 4,
    title: "GRILLED MAC AND CHEESE...",
    author: "Andrew",
    desc: "Make the mac and cheese! Bring a medium saucepan of generously salted...",
  },
];

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Хлібні крихти */}
      <div className="text-xs text-gray-400 mb-6">
        HOME / <span className="text-gray-900 font-medium">SALMON AVOCADO SALAD</span>
      </div>

      {/* Головна двоколонкова сітка сторінки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        {/* ЛІВА КОЛОНКА: Фото */}
        <div>
          <div className="rounded-3xl overflow-hidden bg-gray-100 h-80 md:h-[450px] flex items-center justify-center text-gray-400 shadow-sm">
            <span>Salmon Photo (ID: {id})</span>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: Інформація + Інгредієнти */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            SALMON AVOCADO SALAD
          </h1>

          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Seafood
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              40 min
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            A healthy salad recipe that's big on nutrients and flavor. A moist, pan seared
            salmon is layered on top of spinach, avocado, tomatoes, and red onions.
          </p>

          <div className="flex items-center gap-3 mb-8 pb-6 ">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <p className="text-xs text-gray-400">Created by:</p>
              <p className="text-sm font-semibold text-gray-900">Nadia</p>
            </div>
          </div>

          {/* Секція інгредієнтів */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">INGREDIENTS</h2>

            <div className="grid grid-cols-3 gap-4">
              {mockIngredients.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] text-gray-400">img</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Секція інструкції приготування */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">RECIPE PREPARATION</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              A healthy salad recipe that's big on nutrients and flavor. A moist, pan
              seared salmon is layered on top of spinach, avocado, tomatoes, and red
              onions. Then drizzled with a homemade lemon vinaigrette. Is a healthy salad
              recipe that's big on nutrients and flavor. A moist, pan seared salmon is
              layered on top of spinach, avocado, tomatoes, and red onions. Then drizzled
              with a homemade lemon vinaigrette.
              <br />
              <br />
              Then drizzled with a homemade lemon vinaigrette. Is a healthy salad recipe
              that's big on nutrients and flavor. A moist, pan seared salmon is layered on
              top of spinach, avocado, tomatoes, and red onions.
            </p>

            <button className="px-6 py-3 border border-gray-300 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
              ADD TO FAVORITES
            </button>
          </section>
        </div>
      </div>

      {/* НИЖНІЙ БЛОК: Популярні рецепти */}
      <section className=" mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">POPULAR RECIPES</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularRecipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-col">
              <div className="rounded-3xl overflow-hidden bg-gray-100 h-48 mb-3 flex items-center justify-center text-gray-400 shadow-sm">
                <span>Photo</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                {recipe.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{recipe.desc}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  <span className="text-xs font-medium text-gray-800">
                    {recipe.author}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-50">
                    ♡
                  </button>
                  <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-50">
                    ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default RecipeDetailsPage;
