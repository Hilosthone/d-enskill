import { ChevronDown } from 'lucide-react'

const FAQs = [
  {
    q: 'Can beginners apply?',
    a: 'Absolutely! Our programmes are designed to welcome everyone, from absolute beginners to those looking to sharpen their existing skills.',
  },
  {
    q: 'Do you offer certificates?',
    a: 'Yes, we’re proud to celebrate your hard work! Upon completing your programme and final project, you will receive an official D Enskill Certificate.',
  },
  {
    q: 'Is the training fully remote?',
    a: 'We love flexibility! We use a hybrid model—you can join our core lectures live online, and our physical labs are always open if you’d like to collaborate with peers in person.',
  },
  {
    q: 'What is the duration of the programmes?',
    a: 'Our courses are thoughtfully paced to help you master new skills, typically ranging from 11 to 22 weeks depending on the programme.',
  },
  {
    q: 'Do you provide job support?',
    a: 'We are with you every step of the way. Our career services team is dedicated to helping you shine, from polishing your resume to connecting you with our wonderful hiring partners.',
  },
  {
    q: 'Can I pay in installments?',
    a: 'We believe your future shouldn’t be held back by finances. We offer flexible, friendly payment plans so you can focus on learning while managing your budget.',
  },
]

export default function Faq() {
  return (
    <section
      id='faq'
      className='relative py-24 px-6 overflow-hidden bg-transparent'
    >
      {/* Background Code Layer */}
      <div className='absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.4] pointer-events-none select-none overflow-hidden'>
        <pre className='font-mono text-[11px] leading-tight text-primary-blue [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]'>
          {`// Your Journey at D Enskill
const welcomeStudent = (name) => {
  console.log("Welcome to the family, " + name + "!");
}

// We grow together
const learnPracticalSkills = async () => {
  return await Promise.all([mentorship, handsOnProjects, communitySupport]);
}

// Building your future
function achieveGoals(effort) {
  return effort * passion;
}`}
        </pre>
      </div>

      <div className='relative z-10 max-w-3xl mx-auto'>
        <h2 className='text-4xl font-bold mb-12 text-center text-dark dark:text-white'>
          We’re Here to Help
        </h2>

        {FAQs.map((item, i) => (
          <details
            key={i}
            data-aos='fade-up'
            data-aos-delay={i * 100}
            className='group mb-4 p-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-blue transition-all duration-300'
          >
            <summary className='font-bold cursor-pointer text-dark dark:text-white outline-none flex justify-between items-center list-none'>
              {item.q}
              {/* Lucide Icon with animation */}
              <ChevronDown className='w-5 h-5 transition-transform duration-300 group-open:rotate-180' />
            </summary>
            <p className='mt-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4 leading-relaxed'>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
