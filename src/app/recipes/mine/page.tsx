"use client";
import MenuCard from "@/components/MenuCard";
import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";
import { Food } from "@/interface/recipes";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [searchKey, setsearchKey] = useState<string>(``);
  const [filteredFood, setFilteredFood] = useState<Food[]>([]);
  const [food, setFood] = useState<Food[]>([]);
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

  async function fetchRecipes() {
    await fetch(`/api/recipes/post/ownRecipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ member_email: session?.user?.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFood(data);
        setFilteredFood(data);
      });
  }

  useEffect(() => {
    fetchRecipes();
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
        <div className="h-12 md:h-auto">
          <p className="text-4xl font-bold">My recipes ✨</p>
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
          <button className="flex-grow btn btn-primary bg-orange-500">
            By rating
          </button>
          <button className="flex-grow btn btn-primary bg-purple-500">
            By latest
          </button>
        </div>
        <div className="flex flex-wrap w-full gap-4 mt-4">
          {filteredFood.slice(0, showNumber).map((item: Food) => (
            <MenuCard
              menuName={item.title}
              menuId={item.id}
              src={item.image_url}
              rating={item.current_rating}
              isOwner={true}
              isHome={false}
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
        </div>
      </section>
    </main>
  );
}
