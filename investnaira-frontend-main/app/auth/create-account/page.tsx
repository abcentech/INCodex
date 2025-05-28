"use client";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import invest from "../../../public/images/invest.png";
import { useDispatch } from "react-redux";
import logofullgreen from "../../../public/images/logo-full-green.png";
import Link from "next/link";
import Button from "@/components/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../../../hook/useAuth";
import { useRouter } from "next/navigation";
import { setEmail as setReduxEmail } from "../../../libs/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/spinner";
import { z } from "zod";
import { IoArrowBackOutline } from "react-icons/io5";

const nameSchema = (name: string) =>
  z.string().min(3, `${name} must be at least 3 characters long`);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[!@#$%^&*(),.?":{}|_<>]/,
    "Password must contain at least one special character."
  );

const phoneSchema = z.string().refine((phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 13 && digits.length <= 13;
}, "");

const emailSchema = z
  .string()
  .email("Invalid email address")
  .refine((email) => {
    if (!email.includes("@")) {
      return false; // Email must contain '@' symbol
    }
    const [localPart, domain] = email.split("@");
    return (localPart?.length ?? 0) <= 64 && (domain?.length ?? 0) <= 255;
  }, "Email format is invalid or too long");

const validatePasswords = z
  .object({
    password1: passwordSchema,
    password2: z.string(),
    email: emailSchema,
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

interface UserData {
  email: string;
  phone_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_type: string;
  password1: string;
  password2: string;
}

const Page: React.FC = () => {
  const steps = [
    { number: 1, label: "Enter your details" },
    { number: 2, label: "Set a Password" },
  ];
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [Password, setPassword] = useState(false);
  const dispatch = useDispatch();
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const { handleSignUp, loading, error } = useAuth();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    email: "",
    phone_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    user_type: "CUSTOMER",
    password1: "",
    password2: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword = () => {
    setPassword(!Password);
  };

  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    errorMessage: "",
  });

  const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email);
    if (result.success) {
      setEmailValidation({ isValid: true, errorMessage: "" });
    } else {
      setEmailValidation({
        isValid: false,
        errorMessage: result.error.errors[0]?.message || "Invalid email",
      });
    }
  };

  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    errorMessage: "",
  });

  const validatePhone = (phone: string) => {
    const result = phoneSchema.safeParse(phone);
    if (result.success) {
      setPhoneValidation({ isValid: true, errorMessage: "" });
    } else {
      const errorMessage =
        result.error.errors[0]?.message || "Invalid phone number";
      setPhoneValidation({ isValid: false, errorMessage });
    }
  };

  const [passwordValidation, setPasswordValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|_<>]/.test(password),
      hasMinLength: password.length >= 8,
    });
  };

  const [nameError, setNameError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "password1") {
      if (!isPasswordTouched) {
        setIsPasswordTouched(true);
      }
      validatePassword(value);
    } else if (name === "email") {
      validateEmail(value);
    } else if (
      name === "first_name" ||
      name === "middle_name" ||
      name === "last_name"
    ) {
      const validationResult = nameSchema(name.replace(/_name/, "")).safeParse(
        value
      );
      if (!validationResult.success) {
        setNameError(validationResult.error.errors[0].message);
      } else setNameError("");
    }
  };

  const handlePhoneChange = (phone: string) => {
    setUserData((prev) => ({ ...prev, phone_number: phone }));
    validatePhone(phone);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      if (!emailValidation.isValid) {
        toast.error(emailValidation.errorMessage);
        return;
      }
      setStep(2);
      return;
    }

    const result = validatePasswords.safeParse(userData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input";
      toast.error(errorMessage);
      return;
    }

    try {
      console.log("Submitting user data:", userData);
      const response = await handleSignUp(userData);
      console.log("Signup response:", response);

      if (response && response.success) {
        dispatch(setReduxEmail(userData.email));
        toast.success("Signup successful! Please verify your account.");
        router.push("/auth/verify/create-account");
      } else {
        toast.error(
          response?.message && "Signup unsuccessful. Please try again."
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <ToastContainer />
      <div className="hidden lg:flex lg:w-2/5 bg-[url('/images/Black.png')] items-center justify-center">
        <div className=" flex flex-col items-center justify-center gap-12 my-10 max-w-xl">
          <p className=" font-gilroy font-extrabold text-6xl">
            <span className=" text-white">Build</span> <br />
            <span className=" text-[#D82CD1]">Generational</span> <br />
            <span className=" text-primary">Wealth.</span>
          </p>
          <div className="pr-12 xl:pr-0">
            <Image
              src={invest}
              alt="investment concept"
              width={305}
              height={305}
              className="h-auto max-w-[400px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full lg:w-3/5 px-4 lg:px-0 py-12 lg:py-0 min-h-screen">
        <div className="w-full max-w-[540px] relative">
          {step === 2 && (
            <div
              onClick={handleBack}
              className="absolute -top-20  text-primary cursor-pointer"
            >
              <IoArrowBackOutline size={20} />
            </div>
          )}
          <div className="mb-12 flex justify-center">
            <Image
              src={logofullgreen}
              alt="Investnaira Logo"
              width={180}
              height={65}
              className="w-36 sm:w-44 lg:w-[180px]"
            />
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="relative mb-12 flex flex-col h-10 w-full">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#33363F] mt-4 bg-white absolute bottom-8 left-3 px-1"
                  >
                    Firstname
                  </label>
                  <input
                    id="firstName"
                    name="first_name"
                    type="text"
                    placeholder="Enter Firstname as written in Government ID"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.first_name}
                    onChange={handleChange}
                  />
                  <div className="text-red-500 text-xs">{nameError.includes('first') ? nameError : ''}</div>
                </div>
                <div className="relative mb-12 flex flex-col h-10 w-full">
                  <label
                    htmlFor="MiddleName"
                    className="block text-sm font-medium text-[#33363F] mt-4 bg-white absolute bottom-8 left-3 px-1"
                  >
                    Middlename
                  </label>
                  <input
                    id="MiddleName"
                    name="middle_name"
                    type="text"
                    placeholder="Enter Middlename as written in Government ID"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.middle_name}
                    onChange={handleChange}
                  />
                  <div className="text-red-500 text-xs">{nameError.includes('middle') ? nameError : ''}</div>
                </div>
                <div className="relative mb-12 w-full flex flex-col h-10">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#33363F] mt-4 bg-white absolute bottom-8 left-3 px-1"
                  >
                    Lastname
                  </label>
                  <input
                    id="lastName"
                    name="last_name"
                    type="text"
                    placeholder="Enter Lastname as written in Government ID"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.last_name}
                    onChange={handleChange}
                  />
                  <div className="text-red-500 text-xs">{nameError.includes('last') ? nameError : ''}</div>
                </div>
                <div className="relative mb-12 w-full flex flex-col h-10 ">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#33363F] mt-4 bg-white absolute bottom-8 left-3 px-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email Address"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.email}
                    onChange={handleChange}
                  />
                  {emailValidation.errorMessage && (
                    <p className="text-red-500 text-xs absolute mt-12">
                      {emailValidation.errorMessage}
                    </p>
                  )}
                </div>
                <div className="relative w-full mb-10">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute -top-3 left-3 px-1 z-30"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    country={"ng"}
                    value={userData.phone_number}
                    onChange={handlePhoneChange}
                    inputProps={{
                      id: "phoneNumber",
                      required: true,
                      className:
                        "w-full pl-28 py-3 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px] ",
                    }}
                    containerClass="!w-full"
                    buttonClass="!absolute !top-0 !bottom-0 !left-0 !z-10 !bg-transparent !rounded-l-lg !px-8 "
                    dropdownClass="!w-max"
                  />
                  {phoneValidation.errorMessage && (
                    <p className="text-red-500 text-xs absolute">
                      {phoneValidation.errorMessage}
                    </p>
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="relative w-full mb-9">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password1"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.password1}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {isPasswordTouched && (
                  <div className=" mb-10 grid grid-cols-2 text-[13px]">
                    <p
                      className={
                        passwordValidation.hasLowercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✔ One lowercase character
                    </p>
                    <p
                      className={
                        passwordValidation.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✔ One special character
                    </p>
                    <p
                      className={
                        passwordValidation.hasUppercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✔ One uppercase character
                    </p>
                    <p
                      className={
                        passwordValidation.hasMinLength
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✔ 8 character minimum
                    </p>
                    <p
                      className={
                        passwordValidation.hasNumber
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✔ One number
                    </p>
                  </div>
                )}
                <div className="relative mb-12 w-full">
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
                  >
                    Re - Enter Password
                  </label>
                  <input
                    id="confirm_password"
                    name="password2"
                    type={Password ? "text" : "password"}
                    placeholder="Re - Enter Password"
                    className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                    required
                    value={userData.password2}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {Password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </>
            )}
            <div className="w-full">
              <Button
                type="submit"
                title={
                  step === 1 ? "Next" : loading ? <LoadingSpinner /> : "Proceed"
                }
                className="bg-primary font-semibold rounded-xl w-full text-center py-[10px] px-10 text-white hover:bg-[#409f43] cursor-pointer shadow-md"
                disabled={loading}
              />
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <Link
              href="/auth/login"
              className="text-primary hover:text-green-600 ml-1 font-bold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
