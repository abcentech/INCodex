'use client'
import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import LoadingSpinner from '../components/spinner'; 
import Image from 'next/image';
import amico from '../../../public/images/amico.png'

interface VerificationPageProps {
  email: string;
  onProceed: () => void;
  onResendCode: () => void;
  onChangeEmail: () => void;
  authType: 'login' | 'signup';
  authLink: string;
  onCodeChange: (code: string) => void;
  error: string;
  isLoading: boolean;
}

interface PinItem {
  name: string;
  ref: React.RefObject<HTMLInputElement>;
  next?: React.RefObject<HTMLInputElement>;
  prev?: React.RefObject<HTMLInputElement>;
}

const VerificationPage = ({ 
  email, 
  onProceed, 
  onResendCode, 
  onChangeEmail, 
  authType,
  authLink,
  onCodeChange,
  error,
  isLoading
}: VerificationPageProps) => {
  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const thirdRef = useRef<HTMLInputElement>(null);
  const fourthRef = useRef<HTMLInputElement>(null);
  const fifthRef = useRef<HTMLInputElement>(null);
  const sixthRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState<string>('');
  const [countdown, setCountdown] = useState(120); 
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const startCountdown = () => {
    setCountdown(120);
    setIsResendDisabled(true);

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    const cleanupTimer = startCountdown();
    return cleanupTimer;
  }, []);

  const handleRef = (
    e: React.KeyboardEvent<HTMLInputElement>,
    next?: React.RefObject<HTMLInputElement>,
    prev?: React.RefObject<HTMLInputElement>
  ) => {
    const key = e.key;
    if (e.currentTarget.value.length && next?.current) {
      next.current.focus();
    }

    if ((key === "Backspace" || key === "Delete") && prev?.current) {
      prev.current.focus();
    }

    const newCode = pinData.map(item => item.ref.current?.value || '').join('');
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleRefInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyVal = e.which || e.keyCode;
    if (keyVal < 48 || keyVal > 57) e.preventDefault();
  };

  const pinData: PinItem[] = [
    { name: "first", ref: firstRef, next: secondRef },
    { name: "second", ref: secondRef, next: thirdRef, prev: firstRef },
    { name: "third", ref: thirdRef, next: fourthRef, prev: secondRef },
    { name: "fourth", ref: fourthRef, next: fifthRef, prev: thirdRef },
    { name: "fifth", ref: fifthRef, next: sixthRef, prev: fourthRef },
    { name: "sixth", ref: sixthRef, prev: fifthRef }
  ];

    const handleResendCode = () => {
        if (!isResendDisabled) {
          onResendCode();
          startCountdown();
        }
      };


  return (
    <div className='flex flex-col lg:flex-row h-screen'>
       <div className="hidden lg:block lg:w-2/5 bg-[url('/images/Black.png')]">
      <div className=' flex justify-center items-center min-h-[100vh] pr-16'>
        <Image
        src={amico}
        alt='Verification process'
        width={300}
        height={300}
        />

      </div>
      </div>
      <div className='flex justify-center items-center w-full lg:w-3/5 px-4 lg:px-0 py-8 lg:py-0 min-h-screen'>
        <div className='w-full max-w-[540px]'>
          <div className='mb-12 flex flex-col justify-center text-center'>
            <p className='font-rowdies text-3xl text-center mb-4'>Verification</p>
            <p className="text-sm text-gray-600 mb-8">
              Enter the 6-digit OTP sent to, {email}
            </p>
            <div className="flex justify-between mb-6 w-full">
              {pinData.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  name={item.name}
                  maxLength={1}
                  ref={item.ref}
                  onKeyUp={(e) => handleRef(e, item.next, item.prev)}
                  onKeyPress={handleRefInput}
                  pattern="[0-9]"
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            <div className="flex justify-between text-sm mb-6 w-full">
             <button 
                onClick={handleResendCode} 
                className={`text-gray-600 hover:text-gray-800 ${isResendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isResendDisabled}
              >
                {isResendDisabled ? `Resend Code (${countdown}s)` : 'Resend Code'}
              </button>
              <button onClick={onChangeEmail} className="text-gray-600 hover:text-gray-800">Change Email</button>
            </div>
          </div>
          <div className='w-full' onClick={onProceed}>
            <Button
              type='button'
              title={isLoading ? <LoadingSpinner /> : 'Proceed'}
              className='bg-primary font-semibold rounded-xl w-full text-center py-[10px] px-10 text-white cursor-pointer shadow-md'
              disabled={isLoading}
            />
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
        {authType === 'login' ? "Don't have an account? " : "Already have an account? "}
        <Link href={authLink} className="text-primary hover:text-green-600 ml-1 font-bold">
          {authType === 'login' ? "Signup" : "Sign in"}
        </Link>
      </p>
        </div>
      </div>
    </div>
  )
}

export default VerificationPage