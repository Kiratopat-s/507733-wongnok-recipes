"use client";
import Image from "next/image";
import React, { useState } from "react";
import { DefaultSession } from "next-auth";
import Link from "next/link";

function MenuCard({
  menuName,
  menuId,
  src,
  rating,
  isOwner,
  isHome,
  hh = 0,
  mm = 0,
  difficulty = "Loading...",
}: {
  session?: DefaultSession | null;
  menuName: string;
  menuId: number;
  src: string;
  rating: number;
  isOwner: boolean;
  isHome: boolean;
  hh?: number;
  mm?: number;
  difficulty?: string;
}) {
  const [loadingStatus, setloadingStatus] = useState<boolean>(true);
  return (
    <Link
      key={menuId}
      className="relative rounded-md w-full overflow-hidden"
      href={`/recipes/${menuId}`}
    >
      <p className="z-20 absolute top-0 px-4 py-2 text-center md:text-2xl bg-black rounded-tl rounded-br">
        {menuName}
      </p>
      {isOwner && (
        <Link
          href={`/recipes/edit/${menuId}`}
          className="z-20 absolute bottom-0 left-0 px-4 py-2 text-center md:text-2xl bg-orange-500 hover:bg-gray-800 transition-all duration-300 ease-in-out text-white rounded-bl rounded-tr"
        >
          <i className="fa-solid fa-pen-to-square mr-2"></i>Edit
        </Link>
      )}
      {isHome && (
        <>
          <p className="z-20 absolute right-0 bottom-0 px-4 py-0.5 text-lg md:text-lg text-center bg-black rounded-bl rounded-tr">
            <i className="fa-solid fa-clock mr-2 text-md text-white"></i>
            {hh} h {mm} m
          </p>
          <p
            className={`z-20 absolute left-0 bottom-0 px-4 py-0.5 text-lg md:text-lg text-center bg-black bg-blur-xl ${
              difficulty === "Hard"
                ? `text-red-500`
                : difficulty === "Normal"
                ? `text-orange-500`
                : difficulty === "Easy"
                ? `text-green-500`
                : `text-purple-500`
            } rounded-bl rounded-tr`}
          >
            {difficulty}
          </p>
        </>
      )}
      <p className="z-20 absolute right-0 top-0 px-4 py-2 text-lg md:text-2xl text-center bg-black rounded-bl rounded-tr">
        {rating} <span className=" text-gray-500">/5 </span>⭐
      </p>
      {/* {session && (
        <p className="absolute bottom-0 right-0 px-4 py-2 text-center bg-orange-800 text-white rounded-tl">
          Review✍️
        </p>
      )} */}
      <div className="flex flex-col w-full items-center justify-center bg-white rounded-lg shadow-lg">
        {/* {loadingStatus && <div className="skeleton w-960 h-40"></div>} */}

        <Image
          src={`/images/recipes/${src}`}
          alt={`image for menu ${menuName}`}
          width={1024}
          height={1024}
          className={` w-full h-40 object-cover rounded-lg scale-100 hover:scale-[110%] brightness-[90%] md:brightness-[80%] hover:brightness-[100%] transition-all duration-300 ease-in-out`}
          priority={true}
        />
      </div>
    </Link>
  );
}

export default MenuCard;
