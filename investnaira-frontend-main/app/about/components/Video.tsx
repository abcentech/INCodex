import React from 'react'



const Video = () => {
  const videoUrl = "https://www.youtube.com/embed/Cnz7ViHA0Rg";
  
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 my-8 z--20'>
      <div className='w-full aspect-w-16 aspect-h-9 mb-4'>
        <iframe
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className='rounded-xl w-full h-full'
        >
        </iframe>
      </div>
      <p className="text-xl sm:text-2xl font-medium text-center font-gilroy">A Mission For Every Day & A Vision Set in Stone</p>
    </div>
  )
}

export default Video