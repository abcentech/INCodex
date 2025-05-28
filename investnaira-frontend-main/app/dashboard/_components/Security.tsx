import React, { useState } from "react";

const Security = () => {
  const [isResetClicked, setIsResetClicked] = useState(false);

  const handleButtonClick = () => {
    setIsResetClicked(!isResetClicked);
  };
  return (
    <div className="flex flex-col items-center bg-white  w-full max-w-xl mx-auto mt-16">
      <div className="relative mb-12 w-[380px]">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password1"
          type="password"
          disabled={!isResetClicked}
          placeholder="Enter Password"
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
          required
        />
      </div>
      {isResetClicked && (
        <div className="relative mb-12 w-[380px]">
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Re - Enter Password
          </label>
          <input
            id="confirm_password"
            name="password2"
            type="password"
            placeholder="Re - Enter Password"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
      )}

      <button
        className="mt-4 flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-[380px] mx-auto text-center justify-center "
        onClick={handleButtonClick}
      >
        {isResetClicked ? "Save Changes" : "Reset Password"}
      </button>
    </div>
  );
};

export default Security;
