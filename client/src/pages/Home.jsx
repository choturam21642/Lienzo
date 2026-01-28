import React from 'react'
import Header from '../components/Header.jsx'
import Steps from '../components/Steps'
import Description from '../components/Description.jsx'
import Testimonial from '../components/Testimonial.jsx'
import GenerateBtn from '../components/generateBtn.jsx'

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonial/>
      <GenerateBtn/>
    </div>
  )
}

export default Home