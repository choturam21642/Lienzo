import React from 'react'
import Header from '../components/Header.jsx'
import Steps from '../components/Steps.jsx'
import Description from '../components/Description.jsx'
import Testimonial from '../components/Testimonial.jsx'
import GenerateBtn from '../components/GenerateBtn.jsx'
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonial/>
      <GenerateBtn/>
      <Gallery />
    </div>
  )
}

export default Home