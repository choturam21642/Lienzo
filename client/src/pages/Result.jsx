import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { AppContext } from '../context/Appcontext';

const Result = () => {
  
  //Add some state varialbe
  const [image, setImage] = useState(assets.sample_img_2);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { generateImage } = useContext(AppContext);

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if(input){
  //     const image = await generateImage(input);
  //     if(image){
  //       setImage(image);
  //       setIsImageLoaded(true);
  //     }
  //   }
  //   else{
  //     setLoading(false);
  //   }
  // }



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("1. Starting generation for:", input);

    if(input){
      const image = await generateImage(input);
      console.log("2. Image received from Context:", image ? "YES (Data present)" : "NO (Undefined)");
      
      if(image){
        setIsImageLoaded(true);
        setImage(image);
        console.log("3. State updated: imageLoaded is true");
      }
    }
    setLoading(false);
}



  return (
    // form tag use because we want to submit the input using enter kay
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center justify-center min-h-[90vh]'>
    <div>
      <div className='relative'>
        
        <img src={image} alt="" className='max-w-sm rounded' />
        <span className={`absolute left-0 bottom-0 h-1 bg-blue-700 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
      </div>
      <p className={!loading ? 'hidden' : ''}>
        Loading...
      </p>
    </div>

{!isImageLoaded &&
    <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm rounded-full p-0.5 mt-10'>
      <input onChange={ e => setInput(e.target.value)} value={input} type="text" placeholder='Describe what you want to generate' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20' />
      <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full cursor-pointer'>Generate</button>
    </div>
}
{isImageLoaded &&
    <div className='flex flex-wrap gap-2 mt-10 text-white justify-center text-sm p-0.5 '>
      <p onClick={()=>{setIsImageLoaded(false)}} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate another</p>
      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>
}
    </form>
  )
}

export default Result
