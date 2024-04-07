"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  pronoun: string;
}

function NewRecipe() {
  const blankIngredient: Ingredient = {
    id: 0,
    name: "",
    quantity: 0,
    pronoun: "",
  };

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([
    blankIngredient,
  ]);
  const [howToSteps, setHowToSteps] = useState<string[]>([""]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file && file.size > maxSize) {
      alert("File is too large, please select a file smaller than 10MB.");
      return;
    }

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file); // Store the File object in state
    }
  };

  const handleAddIngredient = () => {
    const maxId = Math.max(
      ...ingredientsList.map((ingredient) => ingredient.id),
      0
    );
    const newIngredient = { ...blankIngredient, id: maxId + 1 };
    setIngredientsList([...ingredientsList, newIngredient]);
  };

  const handleAddHowToStep = () => {
    setHowToSteps([...howToSteps, ""]);
  };

  function handleNameChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.id === id) {
        return { ...ing, name: e.target.value };
      }
      return ing;
    });
    setIngredientsList(newIngredients);
  }

  function handleQuantityChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.id === id) {
        return { ...ing, quantity: Number(e.target.value) };
      }
      return ing;
    });
    setIngredientsList(newIngredients);
  }

  function handlePronounChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const newIngredients = ingredientsList.map((ing) => {
      if (ing.id === id) {
        return { ...ing, pronoun: e.target.value };
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

  async function handleSubmit() {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
      formData.append("ingredients", JSON.stringify(ingredientsList));
      formData.append("howToSteps", JSON.stringify(howToSteps));
      const response = await fetch("/api/recipes/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } else {
      alert("Please select an image.");
    }
  }

  useEffect(() => {
    console.log(ingredientsList);
    console.log(howToSteps);
  }, [selectedImage, ingredientsList, howToSteps]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between pt-24 mx-4">
        <section className="w-full flex flex-col">
          {selectedImage && (
            <Image
              className="rounded-t-lg object-cover w-full h-24"
              src={selectedImage}
              alt="User uploaded image"
              width={512}
              height={512}
            />
          )}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                Pick a photo of your finished recipes
              </span>
              <span className="label-text-alt">less than 10 MB</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageUpload}
            />
            <div className="label"></div>
          </label>
          {selectedImage && (
            <section className="w-full flex flex-col gap-4">
              <label className="form-control">
                <span className="label">Recipe name</span>
                <input
                  type="text"
                  placeholder="Recipe name"
                  className="input input-bordered"
                />
              </label>
              <label className="form-control">
                <span className="label">Description</span>
                <textarea
                  placeholder="Description"
                  className="textarea textarea-bordered"
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
                            handleNameChange(e, ingredient.id)
                          }
                        />
                      </label>
                      <div className="flex gap-4 md:w-1/2">
                        <label className="input input-bordered flex w-1/2 items-center gap-2">
                          <i className="fa-solid fa-boxes-stacked"></i>
                          <input
                            type="text"
                            className="w-full bg-inherit"
                            placeholder="Quantity"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleQuantityChange(e, ingredient.id)
                            }
                          />
                        </label>
                        <label className="input input-bordered flex w-1/2 items-center gap-2">
                          <i className="fa-solid fa-comment-dots"></i>
                          <input
                            type="text"
                            className="w-full bg-inherit"
                            placeholder="Pronoun"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handlePronounChange(e, ingredient.id)
                            }
                          />
                        </label>
                      </div>
                    </>
                  ))}
                  <button
                    onClick={handleAddIngredient}
                    className="btn btn-info bg-purple-500 w-full text-white"
                  >
                    <i className="mr-2 fa-solid fa-plus"></i>Add more
                  </button>
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
                    />
                  </label>
                ))}
              </label>
              <button
                onClick={handleAddHowToStep}
                className="btn btn-info bg-purple-500 w-full text-white"
              >
                <i className="mr-2 fa-solid fa-plus"></i>Add more
              </button>
              <button
                className="btn btn-info text-white bg-blue-500"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </section>
          )}
        </section>
      </main>
    </>
  );
}

export default NewRecipe;
