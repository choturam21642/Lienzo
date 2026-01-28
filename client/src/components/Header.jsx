import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { delay, motion } from "motion/react"
import { AppContext } from '../context/Appcontext.jsx'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const {user, setShowLogin} = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if(user){
      navigate('/result');  
    } else {
      setShowLogin(true);
    }
  }



  return (
    <motion.div className='flex flex-col justify-center items-center text-center my-20'
    initial={{ opacity: 0.3, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{once: true}}
    >

      <div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 border rounded-full border-neutral-500'
        initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.8}}
      >
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="" />
      </div>
      <h1 className='text-4xl max-w-md sm:text-7xl sm:max-w-lg mx-auto mt-10 text-center'>Turn text to <span className='text-blue-600'>image</span>, in seconds</h1>
      <p className='text-center max-w-xl mx-auto mt-5'>Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type and watch the magic happens</p>
      <button onClick={onClickHandler} className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full hover:cursor-pointer'>
        Generate images
        <img className='w-5 h-5' src={assets.star_group} alt="" />
      </button>

      <div className='flex flex-wrap justify-center mt-10 gap-2'>
        {Array(6).fill('').map((Item, index) => (
          <img className='rounded hover:scale-105 transition-all duration-400 cursor-pointer max-sm:w-10' src={index % 2 == 0 ? assets.sample_img_2 : assets.sample_img_1} alt="" key={index} width={70} />
        ))}
      </div>
      <p className='mt-2 text-neutral-600'>Generated images from Lienzo</p>
    </motion.div>
  )
}

export default Home