"use client";
import Nav from "@/components/Nav";
import { useSession } from "next-auth/react";

import MenuCard from "@/components/MenuCard";
import { debounce } from "lodash";
import Typewriter from "typewriter-effect";
import { useState, useEffect, useCallback } from "react";
import { Food } from "@/interface/recipes";

export default function Home() {
  const { data: session } = useSession();
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
    <>
      <Nav session={session} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="flex flex-col text-center gap-4" id="yop-search">
          {/* <h1>What menu is on your mind ?</h1> */}
          <div className="h-28 md:h-auto">
            <span className="text-4xl md:text-6xl font-bold drop-shadow-md drop-shadow-white">
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
    </>
  );
}
