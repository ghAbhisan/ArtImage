import React, { useContext, useState } from 'react'
import { assets, testimonialsData } from '../assets/assets'
import {motion} from 'framer-motion'
import { AppContext } from '../context/AppContext'


const Result = () => {


const [image, setimage]=useState(assets.sample_img_4)
const [isImageLoaded, setIsImageLoaded] = useState(false)
const [generating, setGenerating] = useState(false)
const [input, setInput]=useState('')
const {generateImage}=useContext(AppContext)


const onSubmitHandler= async (e) => {
  e.preventDefault()
  setGenerating(true)

  if(input){
    const Image=await generateImage(input)
    if(Image){
      setimage(Image)
      setIsImageLoaded(true)
    }
  }
  setGenerating(false)
}

  return (
    <motion.form 
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    
    onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'>
    <div>
      <div className='relative'>
        <img src={image} alt="" className='max-w-lg rounded'/>
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${generating ? 'w-full transition-all duration-[10s]' : 'w-0'}`}/>
      </div>
      <p className={!generating ? 'hidden' : ''}>Generating.....</p>
    </div>

{!isImageLoaded && 

    <div className='flex w-full max-w-xl bg-neutral-500  text-white text-sm p-0.5 mt-10 rounded-full'>

      <input 
      onChange={e => setInput(e.target.value)} value={input}
      type="text" placeholder='Describe your idea that you want to create.' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color'/>
      <button type='submit'
      className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'
      >Generate Image</button>
    </div>
    }

{isImageLoaded &&

    <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      <p onClick={()=>{setIsImageLoaded(false)}}
      className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate New !</p>
      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>

}
    </motion.form>
  )
}

export default Result