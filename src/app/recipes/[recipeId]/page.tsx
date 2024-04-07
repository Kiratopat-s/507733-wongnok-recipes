"use client";
import Nav from "@/components/Nav";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";

interface ReceipeDetails {
  id: number;
  name: string;
  rating: number;
  src: string;
  description: string;
  ingredients: Ingredient[];
}

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

interface Comment {
  id: number;
  user: string;
  comment: string;
  rating: number;
  createdAt: Date;
}

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
        if (index < Number(String(rating)[0])) {
          return (
            <input
              key={index}
              type="radio"
              name={`rating-${id}`}
              className="mask mask-star-2 bg-orange-400"
              checked
              readOnly
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
}: {
  comment: string;
  rating: number;
  user: string;
  createdAt: Date;
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
            <img
              alt="Tailwind CSS Navbar component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-bold text-purple-800">{user}</p>
          <p>{createdAt.toLocaleString()}</p>
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
            user={comment.user}
            comment={comment.comment}
            rating={comment.rating}
            createdAt={comment.createdAt}
          />
        </div>
      ))}
      {displayCount < comments.length && (
        <div onClick={loadMore} className="flex gap-2 justify-center">
          <button className="btn self-center w-full">Load more</button>
        </div>
      )}
    </div>
  );
}

function recipesDetails({ params }: { params: { recipeId: string } }) {
  const { data: session } = useSession();
  const details: ReceipeDetails = {
    id: 1,
    name: "กระเพราหมูสับ",
    rating: 4.5,
    src: "/images/recipes/reciepe_1.webp",
    description:
      "คิดไม่ออกว่าจะกินอะไรสุดท้ายก็ต้องมาตายด้วยเมนูนี้ทุกที😆 มาดูกันเมนูง่ายๆ ที่ทำได้ทุกคนกันเลย",
    ingredients: [
      { id: 1, name: "หมูสับ", quantity: "200g" },
      { id: 2, name: "กระเทียม", quantity: "5 กลีบ" },
      { id: 3, name: "พริก", quantity: "5 เม็ด" },
      { id: 4, name: "ใบกะเพรา", quantity: "1 กำ" },
      { id: 5, name: "น้ำปลา", quantity: "1 ช้อนโต๊ะ" },
      { id: 6, name: "น้ำตาล", quantity: "1 ช้อนชา" },
      { id: 7, name: "ซอสหอยนางรม", quantity: "1 ช้อนโต๊ะ" },
      { id: 8, name: "น้ำมันพืช", quantity: "2 ช้อนโต๊ะ" },
      { id: 9, name: "ไข่ไก่", quantity: "1 ฟอง" },
    ],
  };
  const comments: Comment[] = [
    {
      id: 1,
      user: "user1",
      comment: "This product is amazing! Highly recommend!",
      rating: 5,
      createdAt: new Date("2024-04-04T12:30:00Z"),
    },
    {
      id: 2,
      user: "user2",
      comment: "Great value for the price. Works as expected.",
      rating: 4,
      createdAt: new Date("2024-04-03T18:15:00Z"),
    },
    {
      id: 3,
      user: "user3",
      comment: "A little disappointed with the quality. Expected better.",
      rating: 3,
      createdAt: new Date("2024-04-02T10:00:00Z"),
    },
    {
      id: 4,
      user: "user4",
      comment: "Very easy to set up and use. Great customer service!",
      rating: 5,
      createdAt: new Date("2024-04-01午夜 12:00:00"),
    },
    {
      id: 5,
      user: "user5",
      comment: "Missing some features I was hoping for.",
      rating: 2,
      createdAt: new Date("2024-03-31 23:59:59"),
    },
    {
      id: 6,
      user: "user6",
      comment: "Overall, a good product. Would recommend with reservations.",
      rating: 4,
      createdAt: new Date("2024-03-31"),
    },
    {
      id: 7,
      user: "user7",
      comment: "Exactly what I needed! Perfect fit.",
      rating: 5,
      createdAt: new Date(),
    },
    {
      id: 8,
      user: "user8",
      comment:
        "Instructions were a bit confusing. Took some time to figure out.",
      rating: 3,
      createdAt: new Date("2024-04-05"),
    },
    {
      id: 9,
      user: "user9",
      comment: "Beautiful design! Very happy with this purchase.",
      rating: 5,
      createdAt: new Date("2024-04-04"),
    },
    {
      id: 10,
      user: "user10",
      comment: "Just what I expected. No surprises.",
      rating: 4,
      createdAt: new Date("2024-04-03"),
    },
  ];

  const [receipeDeatils, setreceipeDeatils] = useState<ReceipeDetails>(details);
  const [commentList, setcommentList] = useState<Comment[]>(comments);
  const [selectedRating, setSelectedRating] = useState<number>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section
        id="header"
        className="w-[90vw] bg-white mt-3 rounded-md text-black py-2 px-4"
      >
        <div className=" flex flex-col gap-2 justify-center">
          <h1 className="text-3xl font-bold drop-shadow">
            กระเพราหมูสับไข่ดาวเยิ้มๆ
          </h1>
          <Image
            src={`/images/recipes/reciepe_1.webp`}
            alt={`image for menu ${1}`}
            width={1024}
            height={1024}
            className={`self-center w-full h-40 object-cover rounded-lg`}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="rating">
              <DisplayRating id={1} rating={receipeDeatils.rating} />
            </div>
            <p>{receipeDeatils.rating} /5</p>
          </div>
          <div className="flex gap-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-purple-800">username...</p>
              </div>
              <div className="flex flex-col justify-center">
                <p>👁️อ่าน 3.6k ครั้ง</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <p>
              คิดไม่ออกว่าจะกินอะไรสุดท้ายก็ต้องมาตายด้วยเมนูนี้ทุกที😆
              มาดูกันเมนูง่ายๆ ที่ทำได้ทุกคนกันเลย
            </p>
          </div>
        </div>
      </section>
      <section
        id="ingredients"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4"
      >
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-2xl font-bold drop-shadow">📃Ingredient </h1>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {receipeDeatils.ingredients.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
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
          <h1 className="text-2xl font-bold drop-shadow">📃How to </h1>
          <ul className="steps steps-vertical">
            <li className="step step-primary">
              นำกระเทียม พริก สับให้ละเอียด พร้อมทั้งเด็ดใบกระเพรา
            </li>
            <li className="step">นำพริก กระเทียมที่สับใส่ลงในกะทะร้อนๆ </li>
            <li className="step">
              พอกลิ่นเริ่มหอมใส่หมูสับ ผัดสักครู่ ค่อยเติมเครื่องปรุงทั้งหมดลงไป
            </li>
            <li className="step">
              ชิมรสชาติตามชอบ ปิดเเก๊ส ใส่ใบกระเพรา เเค่นี้เป็นอันเสร็จ
            </li>
            <li className="step">
              ตั้งกะทะรอน้ำมันร้อนใส่ไข่ไก่ลงทอดให้ขอบเป็นสีเหลืองกรอบ
              ค่อยตักขึ้นใส่จาน{" "}
            </li>
            <li className="step step-primary">พร้อมทาน</li>
          </ul>
        </div>
      </section>
      <section
        id="Rating"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4 "
      >
        <div className="flex flex-col gap-2 justify-center !text-left">
          <h1 className="text-2xl font-bold drop-shadow">⭐Rating</h1>

          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-20 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <textarea
            className="textarea textarea-primary bg-slate-200"
            placeholder="Write your thought here..."
          ></textarea>

          <div className="rating rating-lg self-center mt-2 mb-3">
            {[1, 2, 3, 4, 5].map((rating, index) => (
              <input
                key={index}
                type="radio"
                name="rating-2"
                value={rating}
                checked={selectedRating === rating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="mask mask-star-2 bg-green-400"
              />
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <button className="btn self-center w-full">Submit</button>
          </div>
        </div>
      </section>
      <section
        id="Comment"
        className="w-[90vw] bg-white mt-6 rounded-md text-black py-2 px-4 "
      >
        <div className="flex flex-col gap-2 justify-center !text-left">
          <h1 className="text-2xl font-bold drop-shadow mb-4">💬Comment</h1>

          <CommentsList comments={commentList} />
        </div>
      </section>
    </main>
  );
}

export default recipesDetails;
