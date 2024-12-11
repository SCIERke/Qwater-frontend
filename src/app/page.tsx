'use client'
import Image from "next/image";
import axios from "axios";
import { useState , useRef } from "react";

export default function Home() {
  const [picture ,setPicture] = useState<any>();
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

  const handleFileChange = (e:any) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (picture) {

      try {
        const formData = new FormData();
        formData.append("file", picture);

        const response = await axios.post("http://localhost:8000/upload-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });

        console.log("File uploaded successfully : ",response.data );

        const imageBlob = new Blob([response.data]);
        const imageUrl = URL.createObjectURL(imageBlob);
        setProcessedImageUrl(imageUrl);

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

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/upload-data", waterData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      SetPredictData(response.data);
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen p-4 cursor-default">
      <div className="flex flex-col w-1/2">
        <div className="open-sans-bold text-5xl">Hello welcome to Qwater</div>
        <div className="open-sans-default text-xl my-4">
        Try adding a picture to see the result
        </div>
        <div className="flex flex-row space-x-1">
          <form>
            <label htmlFor="myFile">Upload your image:</label>
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
        <form onSubmit={handleSubmitData} className="space-y-4">
        {Object.keys(waterData).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
              {field.replace(/_/g, " ")}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={waterData[field as keyof typeof waterData] ?? ""}
              onChange={(e) =>
                setWaterData({
                  ...waterData,
                  [field]: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="mt-1 block w-full max-w-md border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-2/3 bg-black text-white py-2 px-4 rounded hover:bg-opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Submit
        </button>
      </form>
      </div>
      <div className="mt-4 py-4 px-10 bg-gray-100 rounded-md shadow">
        <div className="text-xl font-bold mb-4">Input Data:</div>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2">Parameter</th>
              <th className="px-4 py-2 border-b-2">Value</th>
            </tr>
          </thead>
          {predictData?.input && (
          <tbody>
            {Object.entries(predictData.input).map(([key, value]) => (
              <tr key={key} className="border-t">
                <td className="px-4 py-2">{key.replace(/_/g, ' ')}</td>
                <td className="px-4 py-2">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        )}
        </table>

        <div className="mt-6">
          <div className="text-xl font-bold">Prediction:</div>
          {predictData ? (
            <>
              <p className="mt-2 text-lg">
                <span className="font-semibold">Value:</span> {JSON.stringify(predictData.prediction)}
              </p>
              <p className="mt-1 text-lg">
                <span className="font-semibold">Safety:</span>{" "}
                <span className={predictData.prediction > 0.7 ? "text-green-600" : "text-red-600"}>
                  {predictData.prediction > 0.7 ? "Safe" : "Not Safe"}
                </span>
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg">No prediction data available.</p>
          )}
        </div>
      </div>
      <div>
      {processedImageUrl && (
        <div className="mt-4">
          <div className="open-sans-default text-lg">Processed Image:</div>
          <Image src={processedImageUrl} alt="Processed Image" width={400} height={400} />
        </div>
      )}
      </div>
    </div>
  );
}
