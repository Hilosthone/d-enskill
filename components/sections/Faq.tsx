import { ChevronDown } from 'lucide-react'

export const FAQs = [
  {
    q: 'Can beginners apply?',
    a: 'Yes, our curriculum is designed for all skill levels, from foundational concepts to advanced industry projects.',
  },
  {
    q: 'Do you offer certificates?',
    a: 'Yes, graduates receive an official D Enskill Certificate recognized by our industry partners upon completion.',
  },
  {
    q: 'Is the training fully remote?',
    a: 'We offer a hybrid model. Core lectures are delivered live online, while our physical labs are open for collaborative project sessions.',
  },
  {
    q: 'What is the duration of the programmes?',
    a: 'Most programmes range from 12 to 24 weeks depending on the intensity and the tech stack.',
  },
  {
    q: 'Do you provide job placement support?',
    a: 'Yes, our career services team provides resume reviews, interview prep, and direct connections to hiring partners.',
  },
  {
    q: 'Can I pay in installments?',
    a: 'Yes, we offer flexible payment plans to help you spread your tuition across the programme duration.',
  },
  {
    q: 'What are the extra benefits for students paying 100% regular fees?',
    a: 'Students enrolled in the normal program who pay 100% fees enjoy extra bonuses including physical teaching sessions and mentoring, specialized CV and resume building for real-life work after completion, a longer study week schedule, and a guaranteed post-training internship.',
  },
  {
    q: 'How does the scholarship program differ from the regular program?',
    a: 'The scholarship program is conducted fully online and enjoys a tailored package of core services. Tutors are always ready to answer your questions and provide support throughout your learning journey.',
  },
  {
    q: 'Who is eligible for the D Enskill Scholarship?',
    a: 'The scholarship is open to all ambitious applicants who demonstrate passion, commitment, and readiness for a tech career, regardless of their current financial background.',
  },
  {
    q: 'How do I check my scholarship application status?',
    a: 'You can easily track your review stage anytime by visiting our scholarship page and entering the email address you used during your application.',
  },
  {
    q: 'What percentage of tuition does the scholarship cover?',
    a: 'Selected exceptional candidates can receive up to a 90% tuition discount, significantly lowering the financial barrier to learning.',
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
        <pre className='font-mono text-[11px] leading-tight text-primary-purple [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]'>
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
            className='group mb-4 p-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-purple transition-all duration-300'
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
