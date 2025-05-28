import React, { useState, useEffect } from "react";
import { BiEditAlt } from "react-icons/bi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Autocomplete from "react-google-autocomplete";
import { useAuths } from "../../../hook/useAuths";
import { updateUserData, UserData } from "../../../libs/api";

// interface PersonalDetails {
//   initialData: {
//     first_name: string,
//     last_name: string,
//     email: string,
//     phone_number: string,
//     gender: string,
//     location: string,
//   }
// }

const PersonalDetailsForm =  () => {
  const { user, fetchUser } = useAuths();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});

  useEffect(() => {
    (async () => {
      try {
        const loadUser = async () => {
          await fetchUser();
          setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            phone_number: user?.phone_number || "",
            gender: user?.gender || "",
            location: user?.location || "",
          });
        };
        await loadUser();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(e.target.value)
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone_number: value });
  };

  const handleLocationChange = (place: google.maps.places.PlaceResult) => {
    setFormData({ ...formData, location: place.formatted_address });
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await updateUserData(formData);
        await fetchUser(); // Refresh user data after update
      } catch (error) {
        console.error("Error updating user data:", error);
        // Handle error (e.g., show error message to user)
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col items-center bg-white w-full max-w-xl mx-auto">
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Firstname
          </label>
          <input
            id="firstName"
            name="first_name"
            type="text"
            disabled={!isEditing}
            value={formData.first_name || ""}
            onChange={handleInputChange}
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Lastname
          </label>
          <input
            id="lastName"
            name="last_name"
            disabled={!isEditing}
            type="text"
            value={formData.last_name || ""}
            onChange={handleInputChange}
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="relative flex flex-col md:col-span-2 mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="text"
            disabled={!isEditing}
            value={formData.email || ""}
            onChange={handleInputChange}
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            required
          />
        </div>
        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            disabled={!isEditing}
            defaultValue={formData.gender || ""}
            onChange={handleInputChange}
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            {/* <option value="prefer_not_to_say">Prefer not to say</option> */}
          </select>
        </div>
        <div className="flex flex-col relative mt-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
          >
            Location
          </label>
          <Autocomplete
            apiKey="AIzaSyBXIYvDLCVCcAebvXiwgQwD28ZwpcJr4Uc"
            onPlaceSelected={(place) => handleLocationChange(place)}
            disabled={!isEditing}
            defaultValue={formData.location || ""}
            className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
            options={{
              types: ["(cities)"],
            }}
          />
        </div>
        <div className="flex flex-col md:col-span-2 mt-4">
          <PhoneInput
            country={"ng"}
            disabled={!isEditing}
            value={formData.phone_number}
            onChange={handlePhoneChange}
            inputProps={{
              id: "phoneNumber",
              required: true,
              className:
                "w-full pl-28 py-3 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]",
            }}
            containerClass="!w-full"
            buttonClass="!absolute !top-0 !bottom-0 !left-0 !bg-transparent !rounded-l-lg !px-8 "
            dropdownClass="!w-max"
          />
        </div>
      </div>
      <button
        className="my-12 flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full mx-auto text-center justify-center"
        onClick={handleEditToggle}
      >
        {isEditing ? (
          "Save Changes"
        ) : (
          <>
            <BiEditAlt className="mr-2" /> Edit
          </>
        )}
      </button>
    </div>
  );
};

export default PersonalDetailsForm;
