"use client";
import React, { useState } from 'react'
import CityList from './Components/CityList'
import Hero from './Components/Hero'
import { FaSearch } from "react-icons/fa";

const page = () => {
  const [search, setsearch] = useState(false)
  return (
    <>
      <div className='flex justify-around items-center h-[80px] md:h-[90px] bg-[#f76161c2]  text-xl boxshadow-out'>
        <h1 className='text-2xl font-semibold  '>Weather Forecasting App</h1>
        
      </div>

      <Hero search={search} setsearch={setsearch} />

      <div className='w-full lg:w-4/5 mx-auto  min-h-screen'>
        <CityList search={search} setsearch={setsearch} />
      </div>
    </>
  )
}

export default page
