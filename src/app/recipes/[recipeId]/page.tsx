"use client";
import Nav from "@/components/Nav";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Ingredient, Recipe, Comment } from "@/interface/recipes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function DisplayRating({
  id,
  rating,
}: {
  id: number;
  rating: number;
}): JSX.Element {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => {
        rating = Number(String(rating)[0]);
        if (rating === 0) {
          return (
            <input
              key={index}
              type="radio"
              name={`rating-${id}`}
              className="mask mask-star-2 bg-gray-200"
              readOnly
              disabled
            />
          );
        } else if (index < rating) {
          return (
            <input
              key={index}
              type="radio"
              name={`rating-${id}`}
              className="mask mask-star-2 bg-orange-400"
              checked
              readOnly
              disabled
            />
          );
        } else {
          return (
            <input
              key={index}
              type="radio"
              name={`rating-${id}`}
              className="mask mask-star-2 bg-orange-400"
              readOnly
              disabled
            />
          );
        }
      })}
    </>
  );
}
function DisplayComment({
  comment,
  rating,
  user,
  createdAt,
  image,
}: {
  comment: string;
  rating: number;
  user: string;
  createdAt: Date;
  image: string;
}): JSX.Element {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex gap-2 relative">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <Image height={250} width={250} alt="user avatar" src={image} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-bold text-purple-800">{user}</p>
          <p>
            {new Date(createdAt).toLocaleString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </p>
        </div>
        <p className="text-2xl font-bold absolute right-4 top-4">{rating}⭐</p>
      </div>
      <div className="flex gap-2">
        <p>{comment}</p>
      </div>
      <div className="divider"></div>
    </div>
  );
}
function CommentsList({ comments }: { comments: Comment[] }) {
  const [displayCount, setDisplayCount] = useState(5);

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  return (
    <div>
      {comments.slice(0, displayCount).map((comment, index) => (
        <div key={index}>
          <DisplayComment
            image={comment.member.image_url}
            user={comment.member.name}
            comment={comment.description}
            rating={comment.rating}
            createdAt={comment.posted_date}
          />
        </div>
      ))}
      {displayCount < comments.length && (
        <div onClick={loadMore} className="flex gap-2 justify-center">
          <button className="btn self-center w-full">Load more</button>
        </div>
      )}
      {comments.length === 0 && (
        <div className="flex gap-2 justify-center">
          <p>No comment yet</p>
        </div>
      )}
    </div>
  );
}

function recipesDetails({ params }: { params: { recipeId: string } }) {
  const recipeId = Number(params.recipeId);
  const router = useRouter();
  const { data: session } = useSession();

  // const details: ReceipeDetails = {
  //   id: 1,
  //   name: "กระเพราหมูสับ",
  //   rating: 4.5,
  //   src: "reciepe_1.webp",
  //   description:
  //     "คิดไม่ออกว่าจะกินอะไรสุดท้ายก็ต้องมาตายด้วยเมนูนี้ทุกที😆 มาดูกันเมนูง่ายๆ ที่ทำได้ทุกคนกันเลย",
  //   ingredient: [
  //     { id: 1, name: "หมูสับ", quantity: "200g" },
  //     { id: 2, name: "กระเทียม", quantity: "5 กลีบ" },
  //     { id: 3, name: "พริก", quantity: "5 เม็ด" },
  //     { id: 4, name: "ใบกะเพรา", quantity: "1 กำ" },
  //     { id: 5, name: "น้ำปลา", quantity: "1 ช้อนโต๊ะ" },
  //     { id: 6, name: "น้ำตาล", quantity: "1 ช้อนชา" },
  //     { id: 7, name: "ซอสหอยนางรม", quantity: "1 ช้อนโต๊ะ" },
  //     { id: 8, name: "น้ำมันพืช", quantity: "2 ช้อนโต๊ะ" },
  //     { id: 9, name: "ไข่ไก่", quantity: "1 ฟอง" },
  //   ],
  // };

  const defaultRecipe = {
    id: 0,
    member_id: 0,
    title: "",
    description: "",
    image_url: "initail/default.png",
    steps: [],
    current_rating: 0,
    voted_count: 0,
    read_count: 0,
    is_public: false,
    posted_date: new Date(),
    latest_update: new Date(),
    comment: [], // Relation to Comment
    ingredient: [], // Relation to Ingredient
    time_spent_hh: 0,
    time_spent_mm: 0,
    difficulty: "Loading...",
    member: {
      // Relation to Member
      id: 0,
      name: "",
      email: "",
      image_url:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      rating: 0,
      voted_count: 0,
      comments: [],
      recipes: [],
    },
  };

  const [receipeDeatils, setreceipeDeatils] = useState<Recipe>(defaultRecipe);
  const [commentList, setcommentList] = useState<Comment[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  useEffect(() => {
    console.log(selectedRating);
  }, [selectedRating]);

  const [comment, setComment] = useState<string>("");

  async function handleCommentSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const body = {
      recipe_id: recipeId,
      member_email: session?.user?.email,
      description: comment,
      rating: selectedRating,
    };
    const res = await fetch(`/api/recipes/post/createComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) {
        toast.success("Comment submitted successfully");
        const result = getRecipeDetails(Number(params.recipeId));
        result.then(async (res) => {
          if (res.message === "Recipe not found") {
            toast.error(`Recipe not found`);
            router.push("/recipes/mine");
          } else {
            setreceipeDeatils(res);
          }
        });
        return res;
      } else {
        toast.error("Failed to submit comment");
      }
    });
  }

  async function handleDelteRecipe(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const res = await fetch(`/api/recipes/post/deleteRecipeById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipe_id: recipeId,
        email: session?.user?.email,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      toast.success("Recipe deleted successfully");
      router.push("/recipes/mine");
    } else {
      toast.error("Failed to delete recipe");
    }
  }

  useEffect(() => {
    const result = getRecipeDetails(Number(params.recipeId));
    result.then(async (res) => {
      if (res.message === "Recipe not found") {
        toast.error(`Recipe not found`);
        router.push("/recipes/mine");
      } else {
        setreceipeDeatils(res);
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section
        id="header"
        className="w-[90vw] bg-white mt-3 rounded-md text-black py-2 px-4"
      >
        <div className=" flex flex-col gap-2 justify-center">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold drop-shadow flex flex-col justify-center">
              {receipeDeatils?.title}
            </h1>
            {session?.user?.email === receipeDeatils?.member?.email && (
              <div className="flex gap-2">
                <Link
                  href={`/recipes/edit/${recipeId}`}
                  className="btn bg-orange-500 text-white"
                >
                  <i className="fa-solid fa-pen-to-square mr-2"></i>Edit
                </Link>
                <button
                  onClick={handleDelteRecipe}
                  className="btn bg-red-500 text-white"
                >
                  <i className="fa-solid fa-trash mr-2"></i>Delete
                </button>
              </div>
            )}
          </div>
          <Image
            src={`/images/recipes/${receipeDeatils?.image_url}`}
            alt={`image for menu ${1}`}
            width={1024}
            height={1024}
            className={`self-center w-full h-40 object-cover rounded-lg`}
            priority={true}
          />

          <div className="flex gap-2 justify-between">
            <div className="flex flex-col justify-center">
              <p className="py-2 px-4 bg-purple-500 text-white rounded-md">
                <i className="fa-solid fa-stopwatch mr-2"></i>{" "}
                {receipeDeatils?.time_spent_hh} ชั่วโมง{" "}
                {receipeDeatils?.time_spent_mm} นาที
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p
                className={` py-2 px-4 ${
                  receipeDeatils?.difficulty === "Hard"
                    ? `bg-red-500`
                    : receipeDeatils?.difficulty === "Normal"
                    ? `bg-orange-500`
                    : receipeDeatils?.difficulty === "Easy"
                    ? `bg-green-500`
                    : `bg-slate-500`
                }  text-white rounded-md`}
              >
                <i className="fa-solid fa-fire-burner mr-2"></i>
                {receipeDeatils?.difficulty}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="rating">
              <DisplayRating id={1} rating={receipeDeatils?.current_rating} />
            </div>
            <p>
              <span className="text-orange-500">
                {receipeDeatils.current_rating}
              </span>{" "}
              /5 | ({receipeDeatils.voted_count} voted)
            </p>
          </div>
          <div className="flex gap-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full shadow-lg border-2 border-purple-500">
                <Image
                  alt="user avatar"
                  src={receipeDeatils?.member?.image_url}
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-purple-800">
                  {receipeDeatils?.member?.name}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p>
                  <i className="fa-solid fa-eye mr-2 text-purple-500"></i>Read{" "}
                  <span className="text-purple-500">
                    {receipeDeatils?.read_count?.toLocaleString()}
                  </span>{" "}
                  views
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <p>{receipeDeatils?.description}</p>
          </div>
        </div>
      </section>
      <section
        id="ingredients"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4"
      >
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-2xl font-bold drop-shadow">
            <i className="fa-solid fa-clipboard-list mr-2 text-purple-500"></i>
            Ingredient{" "}
          </h1>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="text-black">
                  <th></th>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {receipeDeatils?.ingredient?.map((item: Ingredient) => (
                  <tr key={item.index + 1}>
                    <th>{item.index + 1}</th>
                    <td>{item.name}</td>
                    <td>
                      {item.quantity} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section
        id="HowToCook"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4 "
      >
        <div className="flex flex-col gap-2 justify-center !text-left">
          <h1 className="text-2xl font-bold drop-shadow">
            <i className="fa-solid fa-rectangle-list mr-2 text-purple-500"></i>
            How to{" "}
          </h1>
          <ul className="steps steps-vertical">
            {receipeDeatils?.steps?.map((step, index) => (
              <li
                key={index}
                className={`step ${
                  index === 0 || index === receipeDeatils?.steps?.length - 1
                    ? `step-primary`
                    : ``
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </section>
      {session && (
        <section
          id="Rating"
          className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4 "
        >
          <div className="flex flex-col gap-2 justify-center !text-left">
            <h1 className="text-2xl font-bold drop-shadow">
              <i className="fa-solid fa-star mr-2 text-purple-500"></i>Rating
            </h1>

            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full shadow-lg border-2 border-blue-500">
                <Image
                  alt="user avatar"
                  src={
                    session?.user?.image ||
                    "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                  width={250}
                  height={250}
                />
              </div>
            </div>
            {session?.user?.email === receipeDeatils?.member?.email ? (
              <>
                <textarea
                  className="textarea textarea-primary bg-slate-200"
                  placeholder="you can't rate your own recipe."
                  disabled
                ></textarea>
              </>
            ) : receipeDeatils?.comment.find(
                (comment) => comment.member.email === session?.user?.email
              ) ? (
              <>
                <textarea
                  className="textarea textarea-primary bg-slate-200 !text-white"
                  placeholder="You can't review menu you have already reviewed."
                  disabled
                ></textarea>
              </>
            ) : (
              <>
                <textarea
                  className="textarea textarea-primary bg-slate-200"
                  placeholder="Write your thought here..."
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="rating rating-lg self-center mt-2 mb-3">
                  {[1, 2, 3, 4, 5].map((rating, index) => (
                    <input
                      key={index}
                      type="radio"
                      name="rating-2"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={(e) =>
                        setSelectedRating(Number(e.target.value))
                      }
                      className="mask mask-star-2 bg-green-400"
                    />
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleCommentSubmit}
                    className="btn self-center w-full"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
      <section
        id="Comment"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4 "
      >
        <div className="flex flex-col gap-2 justify-center !text-left">
          <h1 className="text-2xl font-bold drop-shadow mb-4">
            <i className="fa-solid fa-comments mr-2 text-purple-500"></i>Review
          </h1>
          <CommentsList comments={receipeDeatils?.comment} />
        </div>
      </section>
    </main>
  );
}

export default recipesDetails;

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
