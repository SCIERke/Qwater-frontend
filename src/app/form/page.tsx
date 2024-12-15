'use client'
import Image from "next/image";
import axios from "axios";
import { useState , useRef } from "react";

export default function Form() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [predictData,SetPredictData] = useState<any>();

  const [waterData, setWaterData] = useState<{
    ph: number | null;
    Hardness: number | null;
    Solids: number | null;
    Chloramines: number | null;
    Sulfate: number | null;
    Conductivity: number | null;
    Organic_carbon: number | null;
    Trihalomethanes: number | null;
    Turbidity:number | null;
  }>({
    ph: null,
    Hardness: null,
    Solids: null,
    Chloramines: null,
    Sulfate: null,
    Conductivity: null,
    Organic_carbon: null,
    Trihalomethanes: null,
    Turbidity: null,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      alert(`You selected: ${files[0].name}`);
      const file = files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    alert(`Submit`);
  }

  return (
    <div className="flex flex-wrap w-full h-screen">
      <div className="flex flex-col w-full sm:w-[50%]  p-2 ">
        <div className="open-sans-bold text-7xl w-full flex flex-row justify-center sm:justify-start">
          <div className="mr-2">Qwater</div>
          <img src="/lens.png" alt="lens-form" className="w-[15%] sm:w-[7%]"/>
        </div>
        <form className="flex flex-col sm:flex-row w-full flex-warp">
          <div className="flex flex-col w-full sm:w-[40%] ">
            {Object.keys(waterData).map((field) => (
              <div className="flex flex-col w-full p-1" key={field}>
                <label htmlFor={field} className=".open-sans-default text-sm">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={waterData[field as keyof typeof waterData] ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWaterData({
                      ...waterData,
                      [field]: value === "" ? null : isNaN(Number(value)) ? value : Number(value),
                    });
                  }}
                  className="focus:outline-none rounded-lg py-1 px-4 open-sans-default sm:w-[100%] w-[100%] border-gray-300 border focus:border-black"
                />
              </div>
            ))}

          </div>
          <div className=" h-80 sm:h-full p-3 w-full sm:w-[60%]">
            <div className="flex flex-col justify-center items-center rounded-lg h-full w-ful border-gray-300 border-2 hover:border-black cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="open-sans-default flex flex-col justify-center items-center ">
                <label htmlFor="fileInput" className="cursor-pointer">
                  Tap Here to Upload Your File!
                </label>
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  title="Upload File"
                />
                {preview && <img src={preview} alt="File preview" className="w-[40%] sm:w-full object-cover" />}
              </div>
            </div>
          </div>
        </form>
        <div className="flex w-full justify-center sm:justify-end">
          <button
            type="button"
            className="sm:w-[40%] w-full mt-4 bg-black text-white py-2 px-4 rounded hover:bg-opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-[50%] h-[50%] bg-orange-300 p-2">
        {/* <tr  className="border-t">
          <td className="px-4 py-2">{"d".replace(/_/g, ' ')}</td>
          <td className="px-4 py-2">
          {typeof 1 === 'object' ? JSON.stringify(1) : String(1)}
          </td>
        </tr>
        {processedImageUrl && (
          <div className="mt-4">
            <div className="open-sans-default text-lg">Processed Image:</div>
            <Image src={processedImageUrl} alt="Processed Image" width={400} height={400} />
          </div>
        )} */}
      </div>
    </div>
  );
}