'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import question from "../../../public/images/question.png";

import Link from 'next/link';
import Button from '@/components/Button';
import { requestPasswordReset } from '../../../libs/api'; 
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setEmail as setReduxEmail } from '../../../libs/authSlice';
import LoadingSpinner from '../components/spinner'; 

const Page = () => {
  const [email, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        dispatch(setReduxEmail(email));
        setMessage('Password reset email sent. Please check your inbox.');
        router.push('/auth/verify/forgot-password');
      } else {
        setMessage(result.message || 'Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      <div className="hidden lg:block lg:w-2/5 bg-[url('/images/Black.png')]">
      <div className=' flex justify-center items-center min-h-[100vh]'>
        <Image
        src={question}
        alt='Question mark'
        width={165}
        height={170}
        />

      </div>
      </div>
      <div className='flex justify-center items-center w-full lg:w-3/5 px-4 lg:px-0 py-8 lg:py-0 min-h-screen'>
        <div className='w-full max-w-[540px]'>
          <div className='mb-12 flex justify-center'>
            <p className='font-rowdies text-3xl'>Forgot Password</p>
          </div>
          <form className='w-full' onSubmit={handleSubmit}>
            <div className='relative mb-16 w-full'>
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
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <div className='w-full'>
              <Button
                type='submit'
                title={isLoading ? <LoadingSpinner />  : 'Proceed'}
                className='bg-primary font-semibold rounded-xl w-full text-center py-[10px] px-10 text-white cursor-pointer shadow-md'
                disabled={isLoading}
              />
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? 
            <Link href="/auth/create-account"  className="text-primary hover:text-green-600 ml-1 font-bold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page