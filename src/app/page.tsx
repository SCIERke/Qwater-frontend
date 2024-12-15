'use client'
import Image from "next/image";
import axios from "axios";
import { useState , useRef } from "react";
import { useRouter } from 'next/router';


export default function Home() {
  const router = useRouter();
  const goToFormPage = () => {
    router.push('/form');
  };

  return (
    <div className="flex flex-row w-screen h-screen p-4 cursor-default">
      <button onClick={goToFormPage}>Go to About Page</button>
    </div>
  );
}
