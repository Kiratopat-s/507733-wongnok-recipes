"use client";
import Image from "next/image";
import React, { useState } from "react";
import { DefaultSession } from "next-auth";
import Link from "next/link";

function MenuCard({
  session,
  menuName,
  menuId,
  src,
  rating,
}: {
  session?: DefaultSession | null;
  menuName: string;
  menuId: number;
  src: string;
  rating: number;
}) {
  const [loadingStatus, setloadingStatus] = useState<boolean>(true);
  // console.log(menuName);
  return (
    // <div className="flex w-full">
    <Link key={menuId} className="relative w-full" href={`/recipes/${menuId}`}>
      <p className="absolute top-0 px-4 py-2 text-center md:text-2xl bg-black rounded-tl rounded-br">
        {menuName}
      </p>
      <p className="absolute right-0 px-4 py-2 text-lg md:text-2xl text-center bg-black rounded-bl rounded-tr">
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
          src={src}
          alt={`image for menu ${menuName}`}
          width={1024}
          height={1024}
          className={` w-full h-40 object-cover rounded-lg`}
          loading="lazy"
        />
      </div>
    </Link>
  );
}

export default MenuCard;
