"use client";
import React from 'react'
import Hero from './components/Hero';
import Description from './components/Description';
import Video from './components/Video';
import CoreValues from './components/CoreValues';
import JoinTeam from './components/JoinTeam';

const About = () => {
  return (
    <div>
      <Hero/>
      <Description/>
      <Video/>
      <CoreValues/>
      {/* <JoinTeam/> */}
    </div>
  )
}

export default About
