import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NAP from "@/components/NAP";
import Nav from "@/components/Nav";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wongnok",
  description:
    "A Wongnok web application designed to foster a vibrant community of food enthusiasts in Thailand and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NAP>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          ></link>
        </head>
        <body className={inter.className}>
          <Nav />
          {children}
        </body>
      </html>
    </NAP>
  );
}
