"use client";
import MenuCard from "@/components/MenuCard";
import { debounce } from "lodash";
import Typewriter from "typewriter-effect";
import { useState, useEffect, useCallback } from "react";
import { Food } from "@/interface/recipes";
import Link from "next/link";

export default function Home() {
  const food: Food[] = [
    {
      id: 1,
      name: "กระเพราหมูสับ",
      rating: 4.5,
      src: "/images/recipes/reciepe_1.webp",
    },
    {
      id: 2,
      name: "แพนงหมู",
      rating: 4.6,
      src: "/images/recipes/reciepe_1.webp",
    },
    {
      id: 3,
      name: "ต้มยำกุ้ง",
      rating: 4.1,
      src: "/images/recipes/reciepe_1.webp",
    },
  ];

  const [searchKey, setsearchKey] = useState<string>(``);
  const [filteredFood, setFilteredFood] = useState<Food[]>(food);

  const debouncedSave = useCallback(
    debounce((nextValue) => setFilteredFood(nextValue), 500),
    []
  );

  useEffect(() => {
    if (searchKey === "") {
      debouncedSave(food);
    } else if (searchKey) {
      debouncedSave(
        food.filter((item) => item.name.toLowerCase().includes(searchKey))
      );
    }
  }, [searchKey, debouncedSave]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link
        href={"/recipes/newRecipe"}
        className="btn shadow-lg btn-primary fixed z-40 bottom-6 right-6 text-white font-bold py-3 px- rounded-2xl bg-orange-500 flex md:hidden"
      >
        📝 New post
      </Link>
      <section className="flex flex-col text-center gap-4">
        <div className="h-28 md:h-auto">
          <span className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-md drop-shadow-white">
            <Typewriter
              options={{
                strings: [
                  "What menu is on your mind ?",
                  "What is your favorite food ?",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </div>
        <div className="flex w-full justify-center">
          {/* <div className="flex gap-8 mr-10"> */}
          <div className="form-control flex flex-row justify-center gap-2 w-[90vw]">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full  self-center bg-slate-300 text-black"
              value={searchKey}
              onChange={(e) => {
                setsearchKey(e.target.value);
              }}
            />
            {/* <button
                onClick={() => {}}
                className="btn bg-orange-800 text-white"
              >
                Search
              </button> */}
          </div>
        </div>
        <div className="flex w-full justify-between gap-4">
          <button className="flex-grow btn btn-primary bg-orange-500">
            By rating
          </button>
          <button className="flex-grow btn btn-primary bg-purple-500">
            By latest
          </button>
        </div>
        {/* </div> */}
        <div className="flex flex-wrap w-full gap-4 mt-4">
          {filteredFood.map((item: Food) => (
            <MenuCard
              // session={session}
              menuName={item.name}
              menuId={item.id}
              src={item.src}
              rating={item.rating}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
