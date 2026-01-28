import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext.jsx'
import { useNavigate } from 'react-router-dom'

const GenerateBtn = () => {

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
    <div className='flex flex-col items-center justify-center pb-16'>
        <h3 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-10'>See the magic. Try now</h3>

        <button onClick={onClickHandler} className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full hover:cursor-pointer'>Generate Images
            <img src={assets.star_group} alt="" className='h-6'/>
        </button>
    </div>
  )
}

export default GenerateBtn
