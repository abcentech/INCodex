'use client'
import { useState } from 'react';

const NewsletterForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Subscribed with email:', email);
        setEmail('');
    };

    return (
        <div className="bg-dark rounded-2xl py-8 sm:py-12 lg:py-16 px-6 sm:px-12 lg:px-24 mx-4 sm:mx-8 lg:mx-14 mb-12 sm:mb-16 lg:mb-24">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 text-center font-rowdies">Get regular updates</h2>
            <p className="text-gray-300 text-sm sm:text-[15px] mb-4 sm:mb-6 text-center">
                Get tailored updates on the latest investment trends, platform features, and market insights. <br className="hidden sm:inline" />
                Stay connected and informed for smarter financial decisions.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email address"
                        required
                        className="w-full px-4 sm:px-10 py-3 sm:py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-primary font-semibold text-white px-4 sm:px-6 py-2 rounded-2xl hover:bg-green-600 transition-colors duration-300 absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        Subscribe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsletterForm;