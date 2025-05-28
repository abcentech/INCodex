'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import biometrics from '../../../public/images/biometrics.png'
import Button from '@/components/Button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { confirmPasswordReset } from '../../../libs/api'
import { RootState } from '../../../libs/store'
import { z } from 'zod';
import LoadingSpinner from '../components/spinner';

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[!@#$%^&*(),.?":{}|_<>]/, "Password must contain at least one special character.");

const validatePasswords = z.object({
  password1: passwordSchema,
  password2: z.string(),
}).refine((data) => data.password1 === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
});

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [Password, setPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const email = useSelector((state: RootState) => state.auth.email);
  const otp = useSelector((state: RootState) => state.auth.otp);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword = () => {
    setPassword(!Password);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPassword(value);
    if (!isPasswordTouched) {
      setIsPasswordTouched(true);
    }
    validatePassword(value);
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = validatePasswords.safeParse({
      password1: newPassword,
      password2: confirmPassword
    });

    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid password");
      setIsLoading(false);
      return;
    }

    if (!email || !otp) {
      setError("Missing email or OTP. Please try the reset process again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await confirmPasswordReset(email, otp, newPassword);
      if (response.success) {
        router.push("/auth/login");
      } else {
        setError(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      <div className="hidden lg:block lg:w-2/5 bg-[url('/images/Black.png')]">
        <div className='flex justify-center items-center min-h-[100vh]'>
          <Image
            src={biometrics}
            alt='Verification process'
            width={250}
            height={250}
          />
        </div>
      </div>
      <div className='flex justify-center items-center w-full lg:w-3/5 px-4 lg:px-0 py-8 lg:py-0 min-h-screen'>
        <div className='w-full max-w-[540px]'>
          <div className='mb-12 flex justify-center'>
            <p className='font-rowdies text-3xl'>New Password</p>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="relative mb-9 w-full">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                value={newPassword}
                onChange={handleChange}
                className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                required
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
              <div className="mb-10 grid grid-cols-2 text-[13px]">
                <p className={passwordValidation.hasLowercase ? "text-green-600" : "text-gray-400"}>✔ One lowercase character</p>
                <p className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-400"}>✔ One special character</p>
                <p className={passwordValidation.hasUppercase ? "text-green-600" : "text-gray-400"}>✔ One uppercase character</p>
                <p className={passwordValidation.hasMinLength ? "text-green-600" : "text-gray-400"}>✔ 8 character minimum</p>
                <p className={passwordValidation.hasNumber ? "text-green-600" : "text-gray-400"}>✔ One number</p>
              </div>
            )}
            <div className="relative w-full mb-20">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
              >
                Re - Enter Password
              </label>
              <input
                id="confirmPassword"
                type={Password ? "text" : "password"}
                placeholder="Re - Enter Password"
                value={confirmPassword}
                onChange={handle}
                className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {Password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                title={isLoading ? <LoadingSpinner /> : "Reset Password"}
                className="bg-primary font-semibold rounded-xl w-full text-center py-[10px] px-10 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-95 hover:bg-[#409f43] duration-300 cursor-pointer shadow-md"
                disabled={isLoading}
              />
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?
            <Link href='/auth/create-account' className="text-primary hover:text-green-600 ml-1 font-bold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;