import React, { useContext } from 'react';
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      // image: assets.logo_icon,
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response)=> {
        // console.log(response)
        try {
          const {data} = await axios.post(backendUrl + '/api/user/verify-razor', response, {headers: {token}});

          // console.log(data)
          if (data.success) {
            loadCreditsData();
            navigate('/');
            toast.success('Payment successful, Enjoy your credits :)');
          }else{
            toast.error(data.message);
          }

        } catch (error) {
          toast.error(error.message);
        }
        // Handle the payment success response
        // toast.success('Payment successful!');
        // Optionally, you can call a function to update the user's credits
        // await loadCreditsdata();
        // navigate('/result'); // Redirect to a result page or any other page
      },
      // prefill: {
      //   name: user ? user.name : '',
      //   email: user ? user.email : '',
      // },
      // theme: {
      //   color: '#3399cc',
      // },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    // console.log(planId)
    try {
      if (!user) {
        setShowLogin(true);
      }

      const { data } = await axios.post(backendUrl+ '/api/user/pay-razor', {planId}, {headers:  {token}});

      if (data.success) {
        initPay(data.order);
      } 
      // else {
      //   toast.error(data.message);
      // }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='min-h-[80vh] text-center pt-14 mb-10'
    >
      <button className='border border-gray-400 hover:bg-[#0415c9] hover:text-white hover:scale-105 px-10 py-2 rounded-full mb-6 transition-all duration-300 ease-in'>
        Credit Plans
      </button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose Your Plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img className='w-7' src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} Credits
            </p>

            <button onClick={() => paymentRazorpay(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>
              {user ? 'Grab Yours !' : 'Step in Now !'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;