export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  time: number;
  calories: number;
  difficulty: "Easy" | "Intermediate" | "Professional";
  cuisine: string;
  dietary: string[];
  isNew?: boolean;
}

export const CUISINES = [
  "Indian",
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
] as const;

export const DIFFICULTIES = [
  "Easy",
  "Intermediate",
  "Professional",
] as const;

export const DIETARY = ["Vegetarian", "Vegan", "Gluten-free"] as const;

export const MAX_COOKING_TIME = 120;
export const MAX_CALORIES = 1200;
export const RECIPES_PER_PAGE = 6;

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Glazed Atlantic Salmon Bowl",
    description:
      "Honey soy glazed salmon over rice with fresh edamame and carrots for an easy gourmet meal.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 132,
    time: 15,
    calories: 540,
    difficulty: "Easy",
    cuisine: "Japanese",
    dietary: ["Gluten-free"],
  },
  {
    id: 2,
    title: "Spiced Chickpea Power Bowl",
    description:
      "Hearty spiced chickpeas with spinach, lemon tahini dressing, and quinoa.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 98,
    time: 20,
    calories: 430,
    difficulty: "Easy",
    cuisine: "Indian",
    dietary: ["Vegetarian", "Vegan", "Gluten-free"],
  },
  {
    id: 3,
    title: "Traditional Carbonara",
    description:
      "Silky egg and pecorino sauce with crispy pancetta over fresh pasta.",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 211,
    time: 30,
    calories: 720,
    difficulty: "Intermediate",
    cuisine: "Italian",
    dietary: [],
  },
  {
    id: 4,
    title: "Spiced Lamb Kebabs",
    description:
      "Middle Eastern spiced lamb skewers with cooling mint yogurt sauce.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 87,
    time: 40,
    calories: 610,
    difficulty: "Intermediate",
    cuisine: "Indian",
    dietary: [],
    isNew: true,
  },
  {
    id: 5,
    title: "Artisan Margherita Pizza",
    description:
      "House-made dough with San Marzano tomatoes, buffalo mozzarella, and basil.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 156,
    time: 45,
    calories: 680,
    difficulty: "Intermediate",
    cuisine: "Italian",
    dietary: ["Vegetarian"],
  },
  {
    id: 6,
    title: "Crispy Scallops with Pea Puree",
    description:
      "Pan seared scallops on a bed of sweet pea puree with pancetta crumble.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 74,
    time: 35,
    calories: 390,
    difficulty: "Professional",
    cuisine: "Japanese",
    dietary: ["Gluten-free"],
  },
  {
    id: 7,
    title: "Thai Green Curry",
    description:
      "Fragrant coconut curry with Thai basil, bamboo shoots, and jasmine rice.",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 143,
    time: 30,
    calories: 520,
    difficulty: "Easy",
    cuisine: "Thai",
    dietary: ["Vegan", "Gluten-free"],
  },
  {
    id: 8,
    title: "Tacos al Pastor",
    description:
      "Marinated pork tacos with charred pineapple, onion, and cilantro.",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 189,
    time: 50,
    calories: 590,
    difficulty: "Intermediate",
    cuisine: "Mexican",
    dietary: [],
  },
  {
    id: 9,
    title: "Chana Masala",
    description:
      "Slow simmered chickpeas in a rich tomato curry with warming spices.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 112,
    time: 40,
    calories: 410,
    difficulty: "Easy",
    cuisine: "Indian",
    dietary: ["Vegetarian", "Vegan", "Gluten-free"],
  },
  {
    id: 10,
    title: "Tonkotsu Ramen",
    description:
      "Rich pork bone broth with chashu, soft egg, and fresh noodles.",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 234,
    time: 110,
    calories: 780,
    difficulty: "Professional",
    cuisine: "Japanese",
    dietary: [],
  },
  {
    id: 11,
    title: "Pad Thai",
    description:
      "Classic stir fried rice noodles with tamarind sauce, peanuts, and lime.",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 167,
    time: 25,
    calories: 630,
    difficulty: "Easy",
    cuisine: "Thai",
    dietary: [],
  },
  {
    id: 12,
    title: "Vegetarian Fajita Bowl",
    description:
      "Sizzling peppers and mushrooms with black beans, guacamole, and rice.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviews: 66,
    time: 25,
    calories: 480,
    difficulty: "Easy",
    cuisine: "Mexican",
    dietary: ["Vegetarian", "Vegan"],
  },
];
