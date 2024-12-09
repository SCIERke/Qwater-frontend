'use client'
import Image from "next/image";
import axios from "axios";
import { useState , useRef } from "react";

export default function Home() {
  const [picture ,setPicture] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e:any) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (picture) {

      try {
        const formData = new FormData();
        formData.append("file", picture);

        const response = await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("File uploaded successfully:", response.data);

        setPicture(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center cursor-default">
      <div className="open-sans-bold text-5xl">Hello welcome to Qwater</div>
      <div className="open-sans-default text-xl my-4">
      Try adding a picture to see the result
      </div>
      <div className="flex flex-row space-x-1">
        <form>
          <input
          type="file"
          id="myFile"
          name="filename"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          />
        </form>
        <button
        className="bg-black text-white open-sans-default py-1 px-4 rounded-full cursor-pointer hover:bg-opacity-75"
        onClick={handleSubmit}
        type="submit">
          upload
        </button>
      </div>
    </div>
  );
}
