import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex space-x-2">
        <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>

        <div
          className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"
          style={{
            animationDelay: "0.2s",
          }}
        ></div>

        <div
          className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"
          style={{
            animationDelay: "0.4s",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
