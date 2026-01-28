import React from 'react'
import { assets } from '../assets/assets'

const Description = () => {
    return (
        <div className='flex flex-col items-center justify-center my-24 p-6 sm:px-28'>
            <h1 className='text-3xl sm:text-4xl font-semibold'>Create AI images</h1>
            <p className=' text-gray-600 mb-20 mt-3'>Turn your imagination into visuals</p>
            <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
                <img width={300} src={assets.sample_img_1} alt="" />
                <div>
                    <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI powered text to image generator</h2>
                    <p className='text-gray-600 mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente veritatis dolor ratione officia et quibusdam atque pariatur aliquid facilis. Quod!</p>
                    <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus quisquam necessitatibus inventore, sit sunt rem, ipsa sed molestiae doloremque consequatur, dolore numquam eveniet pariatur illo minus tenetur voluptatum culpa amet.</p>
                </div>
            </div>
        </div>
    )
}

export default Description
