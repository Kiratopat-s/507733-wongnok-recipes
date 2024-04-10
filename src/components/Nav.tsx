"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { DefaultSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

function Nav() {
  const { data: session } = useSession();
  return (
    <nav className="z-50 fixed top-0 w-full p-4 bg-black text-white flex justify-around  rounded-b-lg ring-1 ring-white shadow shadow-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-start item-center align-middle">
        <Link
          className="flex flex-col justify-center hover:text-rose-500 hover:drop-shadow-xl text-2xl font-bold drop-shadow drop-shadow-white cursor-pointer transition-all duration-300 ease-in-out"
          href={"/"}
        >
          <span>
            <i className="fa-solid fa-kitchen-set mr-"></i> วงนอก
            <span className="absolute top-7 left-7 w-full text-[0.8rem] font-normal">
              (คล้าย ๆ วงใน)
            </span>
          </span>
        </Link>
      </div>
      <div className="flex gap-4 md:gap-8 justify-end mr-0 md:mr-10">
        {session && (
          <>
            <div className="flex gap:2 md:gap-4">
              <Link
                href={"/recipes/newRecipe"}
                className="btn shadow-lg btn-primary text-white font-bold py-3 bg-orange-500 md:flex hidden"
              >
                <i className="fa-solid fa-file-pen "></i>New post
              </Link>
              <Link href={"/recipes/mine"} className="btn hidden md:flex">
                <i className="fa-solid fa-book"></i>My recipes
              </Link>
              <div className="avatar">
                <Link
                  href={"/recipes/mine"}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full self-center"
                >
                  <Image
                    src={
                      session.user?.image ||
                      `https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg`
                    }
                    alt={`user avatar`}
                    width={256}
                    height={256}
                    className={`self-center h-5 object-cover rounded-lg`}
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="btn bg-red-500 text-white scale-[90%] md:scale-100"
            >
              <i className="fa-solid fa-right-from-bracket"></i>Logout
            </button>
          </>
        )}
        {!session && (
          <>
            <button
              onClick={() => signIn()}
              className="btn hover:text-rose-500 hover:shadow-rose-500 cursor-pointer transition-all duration-300 ease-in-out"
            >
              <i className="mr-0 fa-solid fa-right-to-bracket"></i>Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
