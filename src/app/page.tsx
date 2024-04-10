"use client";
import MenuCard from "@/components/MenuCard";
import { debounce } from "lodash";
import Typewriter from "typewriter-effect";
import { useState, useEffect, useCallback } from "react";
import { Food } from "@/interface/recipes";
import Link from "next/link";

export default function Home() {
  const [searchKey, setsearchKey] = useState<string>(``);
  const [food, setFood] = useState<Food[]>([]);
  const [filteredFood, setFilteredFood] = useState<Food[]>([]);
  const [loaded, setloaded] = useState<boolean>(false);
  const [showNumber, setShowNumber] = useState<number>(5);

  const debouncedSave = useCallback(
    debounce((nextValue) => setFilteredFood(nextValue), 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchKey(e.target.value);
    if (e.target.value === "") {
      debouncedSave(food);
    } else {
      debouncedSave(
        food.filter((item) => item.title.toLowerCase().includes(e.target.value))
      );
    }
  };

  const handleSortByLatest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilteredFood(
      [...food].sort((a, b) =>
        String(b.posted_date).localeCompare(String(a.posted_date))
      )
    );
  };

  const handleSortByRating = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilteredFood(
      [...food].sort((a, b) => b.current_rating - a.current_rating)
    );
  };

  useEffect(() => {
    fetch("/api/recipes/get/recipesByRating")
      .then((res) => res.json())
      .then((data) => {
        setFood(data);
        setFilteredFood(data);
        setloaded(true);
      });
  }, []);

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
          <div className="form-control flex flex-row justify-center gap-2 w-[90vw]">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full  self-center bg-slate-300 text-black"
              value={searchKey}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-4">
          <button
            onClick={handleSortByRating}
            className="flex-grow btn btn-primary bg-orange-500"
          >
            By rating
          </button>
          <button
            onClick={handleSortByLatest}
            className="flex-grow btn btn-primary bg-purple-500"
          >
            By latest
          </button>
        </div>
        <div className="flex flex-wrap w-full gap-4 mt-4">
          {filteredFood
            .slice(0, showNumber)
            .map((item: Food, index: number) => (
              <MenuCard
                key={index}
                menuName={item.title}
                menuId={item.id}
                src={item.image_url}
                rating={item.current_rating}
                isOwner={false}
                isHome={true}
                hh={item.time_spent_hh}
                mm={item.time_spent_mm}
                difficulty={item.difficulty}
              />
            ))}
          <button
            onClick={() => {
              setShowNumber(showNumber + 10);
            }}
            className="btn w-full"
          >
            Load more
          </button>
          {loaded && filteredFood.length === 0 && (
            <div className="flex flex-col w-full items-center justify-center border-2 border-blue-500 text-2xl text-white rounded-lg shadow-lg p-2">
              <p>We don't have this menu yet. </p>
              <p>
                Be the first to{" "}
                <Link href={"/recipes/newRecipe"} className="text-orange-500">
                  Create
                </Link>{" "}
                this menu : <span className="text-purple-500">{searchKey}</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
