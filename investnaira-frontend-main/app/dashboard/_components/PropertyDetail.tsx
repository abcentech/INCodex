import React from "react";

const PropertyDetail = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-6">
        <div className="mb-10">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#home"
                className="flex items-center space-x-2 text-lg hover:text-green-400"
              >
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#pot"
                className="flex items-center space-x-2 text-lg text-green-400 hover:text-green-400"
              >
                <span>Pot</span>
              </a>
            </li>
            <li>
              <a
                href="#wallet"
                className="flex items-center space-x-2 text-lg hover:text-green-400"
              >
                <span>Wallet</span>
              </a>
            </li>
            <li>
              <a
                href="#profile"
                className="flex items-center space-x-2 text-lg hover:text-green-400"
              >
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a
                href="#logout"
                className="flex items-center space-x-2 text-lg hover:text-green-400"
              >
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Pot</h1>
            <div className="text-4xl font-semibold text-green-500">
              ₦70,000.70
            </div>
            <button className="mt-2 px-4 py-2 bg-black text-white rounded-lg">
              Available
            </button>
          </div>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">ADRON HOMES</h2>
              <p className="text-lg text-gray-600">₦7,000,000.00 / Plot</p>
              <p className="text-sm text-gray-500">EPE, Lagos, Nigeria</p>
            </div>
            <img
              src="/adron-logo.png"
              alt="Adron Homes"
              className="w-16 h-16"
            />
          </div>

          <div className="text-gray-700 mb-6">
            <p>
              Lorem ipsum dolor sit amet consectetur. Nunc eget platea quis
              auctor mi rhoncus pulvinar varius. Eu viverra lobortis in cras.
              Vivamus bibendum donec auctor eget condimentum congue sed
              ultrices.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <img
              src="/image1.jpg"
              alt="Property 1"
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src="/image2.jpg"
              alt="Property 2"
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src="/image3.jpg"
              alt="Property 3"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Pot Calculator</h3>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Amount"
                className="w-1/2 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Duration"
                className="w-1/2 px-4 py-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Calculate
              </button>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg w-full">
            Purchase Pot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
