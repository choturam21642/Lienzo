import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BuyCredit = () => {

  const {user, backendUrl, loadCreditsData, token, setShowLogin} = useContext(AppContext);

  const navigate = useNavigate();

  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
    
  }

  const paymentRazorpay = async (planId) => {
    try {
      if(!user){
        setShowLogin(true);
      }

     const {data} =  await axios.post(backendUrl + '/api/user/pay-razor', {planId}, {headers: {token}})

     if(data.success){
      initpay(data.order);
     }
    } catch (error) {
      toast.error(error.message); 
    }
  }


  return (
    <div className='min-h-[80vh] text-center pt-14'>
      <button className='border border-gray-400 px-10 py-2 mb-6 rounded-full cursor-pointer'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium sm:mb-10 mb-6' >Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((plan, index) => (
          <div key={index}
          className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={35} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{plan.id}</p>
            <p className='text-sm'>{plan.desc}</p>
            <p className='mt-6'><span className='text-3xl font-medium'>${plan.price}</span>/{plan.credits} credits</p>
            <button onClick={()=>paymentRazorpay(plan.id)} className='mt-6 w-full bg-gray-800 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors'> {user ? 'Purchase' : 'Get Started'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredit
