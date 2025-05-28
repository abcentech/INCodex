'use client'
import Button from '@/components/Button';
import { useState } from 'react'

const Subscribe = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Subscribed:', email);
        setEmail('');
      };

  return (
    <form onSubmit={handleSubmit} className='max-w-lg mx-auto mt-8'>
    <div className='flex'>
      <input 
        type="email" 
        value={email}
        placeholder='Enter email' 
        onChange={(e) => setEmail(e.target.value)}
        className='flex-grow px-4 py-2 rounded-l-md focus:outline-none border border-gray-300'
        required
      />
      <Button 
        type='submit'
        title='Subscribe'
        className='bg-primary text-white px-4 sm:px-8 py-2 rounded-r-md hover:bg-green-600 font-semibold whitespace-nowrap'
      />
    </div>
  </form>
  )
}

export default Subscribe
