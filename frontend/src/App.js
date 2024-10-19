import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./components/DataTable";

const sentences = [
  {
    title: "The Journey Begins Here",
    description: "Every great adventure starts with a single step.",
  },
  {
    title: "The Beauty of Nature",
    description: "Nature always wears the colors of the spirit.",
  },
  {
    title: "A Moment of Reflection",
    description: "In the stillness, we find our true selves.",
  },
  {
    title: "The Power of Dreams",
    description: "Dreams are the touchstones of our character.",
  },
  {
    title: "The Joy of Learning",
    description: "Education is the passport to the future.",
  },
  {
    title: "Embracing Change",
    description: "Change is the only constant in life.",
  },
  {
    title: "The Strength of Unity",
    description: "Together we can achieve greatness.",
  },
  {
    title: "The Art of Letting Go",
    description: "Sometimes, the hardest part is saying goodbye.",
  },
  {
    title: "Finding Inner Peace",
    description: "Peace comes from within; do not seek it without.",
  },
  {
    title: "The Gift of Time",
    description: "Time is a precious resource; use it wisely.",
  },
];

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateData = async () => {
    setIsLoading(true);
    try {
      // Select a random sentence
      const randomIndex = Math.floor(Math.random() * sentences.length);
      const { title, description } = sentences[randomIndex];

      await axios.post("http://localhost:5000/api/generate", {
        title,
        description,
      });
      pollForUpdate(); // Start polling after generating data
    } catch (error) {
      console.error("Error generating data:", error);
    }
  };

  const pollForUpdate = async () => {
    const interval = setInterval(async () => {
      const response = await axios.get("http://localhost:5000/api/data");
      const updatedData = response.data;

      const allUpdated = updatedData.every(
        (item) => item.wordCount !== undefined
      );

      setData(updatedData);

      if (allUpdated) {
        setIsLoading(false);
        clearInterval(interval); // Stop polling once data is updated
      }
    }, 5000); // Poll every 5 seconds
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Data Generator</h1>
        <div className="flex justify-center">
          <button
            onClick={generateData}
            disabled={isLoading}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md text-white ${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Data"}
          </button>
        </div>

        <div className="mt-12">
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
