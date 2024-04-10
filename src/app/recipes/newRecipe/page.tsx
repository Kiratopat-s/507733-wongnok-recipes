"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { CreateRecipeData, Ingredient } from "@/interface/recipes";
import { signIn, useSession } from "next-auth/react";
import { PrismaClient, Prisma } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function NewRecipe() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    toast.loading("Redirecting to login page...");
    signIn();
    toast.dismiss();
  }
  const blankIngredient: any = {
    index: 0,
    name: "",
    quantity: 0,
    unit: "",
  };

  const [selectedImage, setSelectedImage] = useState<any>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([
    blankIngredient,
  ]);
  const [howToSteps, setHowToSteps] = useState<string[]>([""]);
  const [timeSpentHH, setTimeSpentHH] = useState<number>(0);
  const [timeSpentMM, setTimeSpentMM] = useState<number>(0);
  const [difficulty, setdifficulty] = useState<string>("normal");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (file && file.size > maxSize) {
      alert("File is too large, please select a file smaller than 1MB.");
      return;
    }

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file); // Store the File object in state
    }
  };

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
    if (selectedFile) {
      const member = await fetch("/api/auth/get/memberDetailsByEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email || "" }),
      });

      if (member.ok) {
        const memberData: Member = await member.json();
        console.log(memberData);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          const base64Image = reader.result;
          if (base64Image === null) {
            console.error("Failed to read the file.");
            return;
          }
          const data: CreateRecipeData = {
            member_id: memberData.id,
            title: title,
            description: description,
            image: base64Image,
            ingredients: ingredientsList,
            howToSteps: howToSteps,
            time_spent_hh: timeSpentHH,
            time_spent_mm: timeSpentMM,
            difficulty: difficulty,
          };

          const response = await fetch("/api/recipes/post/createNewRecipes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((res) => {
            if (res.ok) {
              toast.success("Recipe created successfully!");
            } else {
              toast.error("Failed to create recipe.");
            }
            return res;
          });
          const responseData = await response.json();
          console.log(responseData);
          router.push(`/recipes/${responseData.id}`);
        };
        reader.onerror = () => {
          console.error("AHHHHHHHH!!");
          alert("Something went wrong!");
        };
      } else {
        console.error("Failed to fetch member data");
      }
    }
  }

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
              <span className="label-text-alt">less than 1 MB</span>
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
                  onChange={handleTitleChange}
                />
              </label>
              <label className="form-control ">
                <div className="flex">
                  <span className="label w-1/2">Time spent</span>
                  <span className="label w-1/2">Difficulty</span>
                </div>
                <div className="flex justify-between gap-2">
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="hours"
                    className="input input-bordered w-1/4"
                    onChange={(e) => setTimeSpentHH(Number(e.target.value))}
                  />
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="minutes"
                    className="input input-bordered w-1/4"
                    onChange={(e) => setTimeSpentMM(Number(e.target.value))}
                  />
                  <details id="diff" className="dropdown w-2/4">
                    <summary
                      className={`m-1 btn w-full text-white ${
                        difficulty === "Hard"
                          ? `bg-red-500`
                          : difficulty === "Normal"
                          ? `bg-orange-500`
                          : difficulty === "Easy"
                          ? `bg-green-500`
                          : `bg-slate-500`
                      } `}
                    >
                      {difficulty}
                    </summary>
                    <ul className=" p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box ">
                      <li
                        onClick={() => {
                          setdifficulty("Easy");
                          document
                            .getElementById("diff")
                            ?.removeAttribute("open");
                        }}
                        className="w-full"
                      >
                        <a>Easy</a>
                      </li>
                      <li
                        onClick={() => {
                          setdifficulty("Normal");
                          document
                            .getElementById("diff")
                            ?.removeAttribute("open");
                        }}
                        className="w-full"
                      >
                        <a>Normal</a>
                      </li>
                      <li
                        onClick={() => {
                          setdifficulty("Hard");
                          document
                            .getElementById("diff")
                            ?.removeAttribute("open");
                        }}
                        className="w-full"
                      >
                        <a>Hard</a>
                      </li>
                    </ul>
                  </details>
                </div>
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
                          />
                        </label>
                        <label className="input input-bordered flex w-1/2 items-center gap-2">
                          <i className="fa-solid fa-comment-dots"></i>
                          <input
                            type="text"
                            className="w-full bg-inherit"
                            placeholder="unit"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleUnitChange(e, ingredient.index)
                            }
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
          )}
        </section>
      </main>
    </>
  );
}

export default NewRecipe;
