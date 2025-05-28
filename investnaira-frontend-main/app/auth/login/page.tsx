'use client'
import Image from 'next/image'
import invest from "../../../public/images/invest.png"
import React, { useState } from 'react'
import logofullgreen from "../../../public/images/logo-full-green.png";
import Link from 'next/link';
import Button from '@/components/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../../libs/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/spinner'; 

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      } else {
        const errorMessage = response.statusCode === 400 
        ? "Something went wrong" 
        : "Invalid credentials";
      toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      <div className="hidden lg:flex lg:w-2/5 bg-[url('/images/Black.png')] items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-12 my-10 max-w-xl'>
          <p className='font-gilroy font-extrabold text-6xl '> 
            <span className='text-white'>Build</span> <br />
            <span className='text-[#D82CD1]'>Generational</span> <br /> 
            <span className='text-primary'>Wealth.</span> 
          </p>
          <div className='pr-12 xl:pr-0'>
            <Image
              src={invest}
              alt='investment concept'
              width={305}
              height={305}
              className="h-auto max-w-[300px]"
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center w-full lg:w-3/5 px-4 lg:px-8 xl:px-16 py-8 lg:py-0 min-h-screen'>
        <div className='w-full max-w-[540px]'>
          <div className='mb-12 flex justify-center'>
            <Image
              src={logofullgreen}
              alt="Investnaira Logo"
              width={180}
              height={65}
              className="w-36 sm:w-44 lg:w-[180px]"
            />
          </div>
          <form className='w-full' onSubmit={handleSubmit}>
            <div className='relative mb-12 w-full'>
              <label htmlFor="email" className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='relative w-full'>
              <label htmlFor="password" className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="py-3 w-full pl-8 pr-16 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="text-right mb-20 mt-2">
              <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot Password?
              </Link>
            </div>
            <div className='w-full'>
              <Button
                type='submit'
                title={isLoading ? <LoadingSpinner /> : 'Proceed'}
                className='bg-primary font-semibold rounded-xl w-full text-center py-[10px] px-10 text-white cursor-pointer shadow-md'
                disabled={isLoading}
              />
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? 
            <Link href="/auth/create-account" className="text-primary hover:text-green-600 ml-1 font-bold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page