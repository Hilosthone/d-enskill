'use client'
import * as Scroll from 'react-scroll'
const Element = Scroll.Element

// Components
import Hero from '@/components/sections/Hero'
import Statistics from '@/components/sections/Statistics'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import About from '@/components/sections/About'
import Programmes from '@/components/sections/Programmes'
import Scholarship from '@/components/sections/Scholarship'
import Admission from '@/components/sections/Admission'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <main className='pt-24'>
      <Element name='home'>
        <Hero />
        <Statistics />
      </Element>
      <Element name='about'>
        <About />
      </Element>
      <Element name='why-us'>
        <WhyChooseUs />
      </Element>
      <Element name='programmes'>
        <Programmes />
      </Element>
      <Element name='scholarship'>
        <Scholarship />
      </Element>
      <Element name='admission'>
        <Admission />
      </Element>
      <Element name='faq'>
        <Faq />
      </Element>
      <Element name='contact'>
        <Contact />
      </Element>
    </main>
  )
}
