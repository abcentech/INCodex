import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";

const BankCardsForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  return (
    <div>
      <div className="mt-12 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div className="relative flex flex-col md:col-span-2 mt-4">
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Account Number
          </label>
          <input
            id="accountNumber"
            name="account_number"
            type="text"
            disabled={!isEditing}
            placeholder="041123699"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="relative flex flex-col md:col-span-2 mt-4">
          <label
            htmlFor="bank"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Bank
          </label>
          <input
            id="bank"
            name="bank"
            type="text"
            disabled={!isEditing}
            placeholder="Access Bank"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="relative flex flex-col md:col-span-2 mt-4">
          <label
            htmlFor="bank"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Card Number
          </label>
          <input
            id="bank"
            name="bank"
            type="text"
            disabled={!isEditing}
            placeholder="0000-0000-0000-0000"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>

        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="cvc"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            CVC
          </label>
          <input
            id="cvc"
            name="cvc"
            type="text"
            disabled={!isEditing}
            placeholder="001"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Exp Date
          </label>
          <input
            id="expiryDate"
            name="expiry_date"
            type="text"
            disabled={!isEditing}
            placeholder="02/25"
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>

        <div className="relative flex flex-col md:col-span-2 ">
          <button
            className="my-12 flex items-center bg-primary text-white px-4 py-2   rounded-lg hover:bg-green-600 transition-colors w-full mx-auto text-center justify-center "
            onClick={handleEditToggle}
          >
            {isEditing ? (
              "Save Changes"
            ) : (
              <>
                <BiEditAlt className="mr-2" /> Edit
              </>
            )}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankCardsForm;
