"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  CreateRecipeData,
  Ingredient,
  Recipe,
  UpdateRecipeData,
} from "@/interface/recipes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function EditRecipe({ params }: { params: { recipeId: string } }) {
  const recipeId = Number(params.recipeId);
  const router = useRouter();
  const { data: session } = useSession();
  const blankIngredient: any = {
    id: 0,
    name: "",
    quantity: 0,
    unit: "",
  };

  const [selectedImage, setSelectedImage] = useState<any>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [howToSteps, setHowToSteps] = useState<string[]>([""]);

  const handleAddIngredient = () => {
    const maxId = Math.max(
      ...ingredientsList.map((ingredient) => ingredient.index),
      0
    );
    const newIngredient = { ...blankIngredient, index: maxId + 1 };
    setIngredientsList([...ingredientsList, newIngredient]);
  };

  const handleDeleteIngredient = () => {
    const newIngredients = ingredientsList.slice(0, ingredientsList.length - 1);
    setIngredientsList(newIngredients);
  };

  const handleAddHowToStep = () => {
    setHowToSteps([...howToSteps, ""]);
  };

  const handleDeleteHowToStep = () => {
    const newHowToSteps = howToSteps.slice(0, howToSteps.length - 1);
    setHowToSteps(newHowToSteps);
  };

  function handleNameChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.index === index) {
        return { ...ing, name: e.target.value };
      }
      return ing;
    });
    setIngredientsList(newIngredients);
  }

  useEffect(() => {
    console.log(ingredientsList);
  }, [ingredientsList]);

  function handleQuantityChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.index === index) {
        return { ...ing, quantity: Number(e.target.value) };
      }
      return ing;
    });
    setIngredientsList(newIngredients);
  }

  function handleUnitChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.index === index) {
        return { ...ing, unit: e.target.value };
      }
      return ing;
    });
    setIngredientsList(newIngredients);
  }

  function handleHowToStepChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const newHowToSteps = howToSteps.map((step, i) => {
      if (i === index) {
        return e.target.value;
      }
      return step;
    });
    setHowToSteps(newHowToSteps);
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  async function handleSubmit() {
    const member = await fetch("/api/auth/get/memberDetailsByEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session?.user?.email || "" }),
    });

    if (member.ok) {
      // const memberData: Member = await member.json();
      // console.log(memberData);
      const data: UpdateRecipeData = {
        recipe_id: recipeId,
        title: title,
        description: description,
        ingredients: ingredientsList,
        howToSteps: howToSteps,
      };

      const response = await fetch(
        "/api/recipes/post/updateRecipesByRecipeId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((res) => {
        if (res.ok) {
          toast.success("Recipe updated successfully");
          router.push(`/recipes/${recipeId}`);
        } else {
          toast.error("Failed to update recipe");
        }
        return res;
      });

      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error("Failed to fetch member data");
    }
  }

  useEffect(() => {
    const result = getRecipeDetails(recipeId);
    result.then((data: Recipe) => {
      if (session?.user?.email !== data.member.email) {
        toast.error("You are not authorized to edit this recipe");
        router.push("/recipes/mine");
      } else {
        setSelectedImage(data.image_url);
        setTitle(data.title);
        setDescription(data.description || "");
        setIngredientsList(data.ingredient);
        setHowToSteps(data.steps);
      }
    });
  }, []);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between pt-24 mx-4">
        <section className="w-full flex flex-col">
          <Image
            className="rounded-t-lg object-cover w-full h-24"
            src={`/images/recipes/${selectedImage}`}
            alt="User uploaded image"
            width={512}
            height={512}
          />

          <section className="w-full flex flex-col gap-4">
            <label className="form-control">
              <span className="label">Recipe name</span>
              <input
                type="text"
                placeholder="Recipe name"
                className="input input-bordered"
                onChange={handleTitleChange}
                value={title}
              />
            </label>
            <label className="form-control">
              <span className="label">Description</span>
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
            <label className="form-control ">
              <span className="label">Ingredients</span>
              <div className="flex flex-wrap justify-center w-full gap-2">
                {ingredientsList.map((ingredient: Ingredient) => (
                  <>
                    <label className="input input-bordered flex w-full md:w-[48%] items-center gap-2 ">
                      <i className="fa-solid fa-wheat-awn"></i>
                      <input
                        type="text"
                        className="w-full bg-inherit"
                        placeholder="Ingredient"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleNameChange(e, ingredient.index)
                        }
                        value={ingredient.name}
                      />
                    </label>
                    <div className="flex gap-2 md:w-1/2">
                      <label className="input input-bordered flex w-1/2 items-center gap-2">
                        <i className="fa-solid fa-boxes-stacked"></i>
                        <input
                          type="text"
                          className="w-full bg-inherit"
                          placeholder="Quantity"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleQuantityChange(e, ingredient.index)
                          }
                          value={String(ingredient.quantity)}
                        />
                      </label>
                      <label className="input input-bordered flex w-1/2 items-center gap-2">
                        <i className="fa-solid fa-comment-dots"></i>
                        <input
                          type="text"
                          className="w-full bg-inherit"
                          placeholder="Unit"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleUnitChange(e, ingredient.index)
                          }
                          value={ingredient.unit}
                        />
                      </label>
                    </div>
                  </>
                ))}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleAddIngredient}
                    className="btn btn-info bg-purple-500 w-1/2 text-white"
                  >
                    <i className="mr-2 fa-solid fa-square-plus"></i>Add more
                  </button>
                  <button
                    onClick={handleDeleteIngredient}
                    className="btn btn-info bg-red-500 w-1/2 text-white"
                  >
                    <i className="mr-2 fa-solid fa-square-minus"></i>Delete
                  </button>
                </div>
              </div>
            </label>
            <label className="form-control gap-4">
              <span className="label">How to cook</span>
              {howToSteps.map((step, index) => (
                <label className="input input-bordered flex w-full items-center gap-2">
                  <p className="font-bold ">{index + 1}</p>
                  <input
                    type="text"
                    className="w-full bg-inherit"
                    placeholder={`step ${index + 1}...`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      handleHowToStepChange(e, index);
                    }}
                    value={step}
                  />
                </label>
              ))}
            </label>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleAddHowToStep}
                className="btn btn-info bg-purple-500 w-1/2 text-white"
              >
                <i className="mr-2 fa-solid fa-plus"></i>Add more
              </button>
              <button
                onClick={handleDeleteHowToStep}
                className="btn btn-info bg-red-500 w-1/2 text-white"
              >
                <i className="mr-2 fa-solid fa-square-minus"></i>Delete
              </button>
            </div>
            <button
              className="btn btn-info text-white bg-blue-500"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </section>
        </section>
      </main>
    </>
  );
}

export default EditRecipe;

async function getRecipeDetails(recipeId: number) {
  const res = await fetch(`/api/recipes/get/recipeDetailById`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipe_id: recipeId }),
  });
  return res.json();
}
