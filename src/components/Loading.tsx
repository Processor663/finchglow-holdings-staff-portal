import React from "react";
import Image from "../assets/favicon.png";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 absolute w-full h-full bg-white dark:bg-ink-950">
      <div className="flex items-center justify-center mb-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#0370AB]" />
      </div>
      <img src={Image} alt="Loading" className="w-12 h-12" />
    </div>
  );
};

export default Loading;
