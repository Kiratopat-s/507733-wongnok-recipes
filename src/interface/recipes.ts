export interface Food {
    id: number;
    title: string;
    current_rating: number;
    image_url: string;
    posted_date: Date;
    time_spent_hh: number;
    time_spent_mm: number;
    difficulty: string;
}

export interface Comment {
    id: number;
    member_id: number;
    recipe_id: number;
    description: string;
    posted_date: Date;
    rating: number;
    member: Member; // Relation to Member
    recipe: Recipe; // Relation to Recipe
}

export interface Ingredient {
    recipe_id: number;
    name: string;
    quantity: number;
    unit: string;
    index: number;
    // recipe: Recipe; // Relation to Recipe
}

export interface Member {
    id: number;
    name: string;
    email: string;
    image_url: string;
    rating: number;
    voted_count: number;
    comments: Comment[]; // Relation to Comment
    recipes: Recipe[]; // Relation to Recipe
}

export interface Recipe {
    id: number;
    member_id: number;
    title: string;
    description?: string;
    image_url: string;
    steps: string[];
    current_rating: number;
    voted_count: number;
    read_count: number;
    is_public: boolean;
    posted_date: Date;
    latest_update: Date;
    time_spent_hh: number;
    time_spent_mm: number;
    difficulty: string;
    comment: Comment[]; // Relation to Comment
    ingredient: Ingredient[]; // Relation to Ingredient
    member: Member; // Relation to Member
}

export interface CreateRecipeData {
    member_id: number;
    title: string;
    description: string;
    image: string | ArrayBuffer;
    time_spent_hh: number;
    time_spent_mm: number;
    difficulty: string;
    ingredients: Ingredient[];
    howToSteps: string[];
}

export interface UpdateRecipeData {
    recipe_id: number
    title: string;
    description: string;
    ingredients: Ingredient[];
    howToSteps: string[];
}
