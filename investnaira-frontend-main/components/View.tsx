import Image from 'next/image';
import React from 'react';
import layer from '../public/layer.png';
import leverage from '../public/leverage.png';
import transaction from '../public/transaction.png';

const View = () => {
  return (
    <div className="flex flex-col items-center px-4 lg:py-8 md:px-8 lg:px-16 mb-32">
      {/* Leverage text in oval shape */}
      <div className="relative w-full max-w-[880px] mb-14 md:mb-20">
        <Image
          src={layer}
          alt="dashed line"
          width={400}
          height={10}
          className="absolute right-[82%] -bottom-28 md:-bottom-20 lg:bottom-8"
        />
        <div className='lg:ml-56 md:ml-44 ml-28'>
          <Image
            src={leverage}
            alt="By leveraging technology, we aim to establish a secure & transparent environment that fosters trust & confidence among our users."
            layout="responsive"
            width={800}
            height={200}
          />

        </div>
      </div>

      {/* Transaction tab */}
      <div className='w-full max-w-4xl'>
        <Image
          src={transaction}
          alt='transaction tab'
          layout="responsive" 
          width={1000}
          height={600}
        />
      </div>
    </div>
  );
};

export default View;
