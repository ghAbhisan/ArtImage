import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'

const Description = () => {
    return (
        <motion.div 
        initial={{opacity:0.2, y:100}}
        transition={{duration:1}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='flex flex-col items-center justify-center my-24 p-6 md:px-28' >
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2' >Generate Images Instantly ⚡</h1>
            <p className='text-gray-500 mb-8'>Shape your thoughts into visuals</p>

            <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center' >
                <img src={assets.sample_img_3} alt="" className='w-80 xl:w-96 rounded-lg' />
                <div >
                    <h2 className='text-3xl font-medium max-w-lg mb-4'>Presenting the Power of AI Magic: Text to Image Creation</h2>
                    <p className='text-gray-600 mb-4'>Effortlessly turn your ideas into reality with our free AI image generator. Whether you're looking for breathtaking visuals or one-of-a-kind designs, our tool transforms your text into captivating images in just moments. Simply describe it, envision it, and let AI bring it to life instantly.</p>
                    <p className='text-gray-600'>Just enter a text prompt, and our state-of-the-art AI will craft stunning images in moments. Whether it’s for product visuals, character sketches, or even entirely new concepts, our tool makes it all possible with ease. With the power of advanced AI, the creative opportunities are endless.</p>
                </div>
            </div>
        </motion.div>
    )
}

export default Description