import React from 'react'
import { assets, testimonialsData } from '../assets/assets'

const Testimonial = () => {
    return (
        <div className='flex flex-col items-center justify-center my-20 py-12'>
            <h1 className='text-3xl sm:text-4xl font-semibold '>Customer Testimonials</h1>
            <p className='text-gray-600 mb-12'>What Our Users Are Saying</p>
            <div className='flex flex-wrap gap-6'>
                {testimonialsData.map((Testimonial, index) => (
                    <div key={index}
                    className='bg-white/20 p-12 rounded-lg shadow-md w-full sm:w-80 flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300'>
                        <div className='flex flex-col items-center'>
                            <img src={Testimonial.image} alt={Testimonial.name} className='w-14 rounded-full' />
                            <h2 className='text-xl font-semibold mt-4'>{Testimonial.name}</h2>
                            <p className='text-gray-500 mb-4'>{Testimonial.role}</p>
                            <div className='flex mb-4'>
                                {Array(Testimonial.stars).fill().map((item, index) => (
                                    <img key={index} src={assets.rating_star} alt="star" className='w-4' />
                                ))}
                            </div>
                            <p className='text-center text-sm text-gray-600'>{Testimonial.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial