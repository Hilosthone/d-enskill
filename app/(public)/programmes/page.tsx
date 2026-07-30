'use client'

import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Code,
  Target,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const PROGRAMME_DATA = [
  {
    name: 'Frontend Development',
    duration: '11 Weeks',
    price: '₦80,000',
    topics: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Next.js',
      'Tailwind',
      'TypeScript',
      'Deployment',
    ],
    projects: ['Portfolio', 'E-commerce Site', 'Dashboard'],
    career: ['Frontend Dev', 'React Dev'],
  },
  {
    name: 'Backend Development',
    duration: '11 Weeks',
    price: '₦80,000',
    topics: [
      'Node.js',
      'Express',
      'MongoDB',
      'REST APIs',
      'Auth',
      'JWT',
      'Deployment',
    ],
    projects: ['Auth API', 'E-commerce Backend', 'Portal'],
    career: ['Backend Dev', 'API Dev'],
  },
  {
    name: 'Full Stack Development (MERN)',
    duration: '22 Weeks',
    price: '₦200,000',
    topics: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Authentication',
      'Deployment',
    ],
    projects: ['Large Scale App', 'Real-time Chat App'],
    career: ['Full Stack Developer'],
  },
  {
    name: 'Full Stack Development (Python)',
    duration: '22 Weeks',
    price: '₦200,000',
    topics: [
      'Python',
      'Django/FastAPI',
      'PostgreSQL',
      'REST APIs',
      'Auth',
      'Deployment',
    ],
    projects: ['Internal Business Tools', 'Data-driven Web App'],
    career: ['Python Backend Dev', 'Full Stack Developer'],
  },
  {
    name: 'Mobile Development',
    duration: '11 Weeks',
    price: '₦100,000',
    topics: ['React Native', 'Expo', 'Firebase', 'API Integration'],
    projects: ['Food App', 'Banking App', 'Chat App'],
    career: ['Mobile Dev'],
  },
  {
    name: 'Cybersecurity',
    duration: '11 Weeks',
    price: '₦100,000',
    topics: ['Network Security', 'Ethical Hacking', 'Pen Testing', 'Cryptography'],
    projects: ['Vulnerability Assessment', 'Pen Testing Report'],
    career: ['Cybersecurity Analyst', 'Ethical Hacker'],
  },
  {
    name: 'Data Science',
    duration: '11 Weeks',
    price: '₦80,000',
    topics: ['Python', 'NumPy', 'Pandas', 'ML Basics', 'Visualization'],
    projects: ['Data Analysis Projects'],
    career: ['Data Scientist'],
  },
  {
    name: 'AI & Machine Learning',
    duration: '22 Weeks',
    price: '₦200,000',
    topics: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
    projects: ['Image Recognition App', 'Chatbot'],
    career: ['AI Engineer', 'ML Engineer'],
  },
  {
    name: 'Web and Blockchain Development',
    duration: '22 Weeks',
    price: '₦200,000',
    topics: ['Solidity', 'Ethereum'],
    projects: ['Decentralized App', 'Smart Contract'],
    career: ['Blockchain Developer'],
  },
  {
    name: 'UI/UX Design',
    duration: '11 Weeks',
    price: '₦80,000',
    topics: ['Figma', 'Design Systems', 'Wireframes', 'Prototypes', 'Research'],
    projects: ['App Designs', 'Case Studies'],
    career: ['UI/UX Designer'],
  },
]

function ProgrammeCard({ prog }: { prog: (typeof PROGRAMME_DATA)[0] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex justify-between items-center text-left'
      >
        <div>
          <h2 className='text-2xl font-bold text-dark dark:text-white'>
            {prog.name}
          </h2>
          <p className='text-primary-purple font-semibold'>
            {prog.duration} • {prog.price}
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className='text-gray-400' />
        ) : (
          <ChevronDown className='text-gray-400' />
        )}
      </button>

      {isOpen && (
        <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-800'>
          <div className='grid grid-cols-2 gap-6 mb-6'>
            <div>
              <h4 className='font-bold text-xs uppercase text-gray-400 mb-2 flex items-center gap-2'>
                <Code size={14} /> Topics
              </h4>
              <ul className='text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                {prog.topics.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-xs uppercase text-gray-400 mb-2 flex items-center gap-2'>
                <Target size={14} /> Projects
              </h4>
              <ul className='text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                {prog.projects.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          </div>
          <h4 className='font-bold text-xs uppercase text-gray-400 mb-2 flex items-center gap-2'>
            <Briefcase size={14} /> Career
          </h4>
          <div className='flex flex-wrap gap-2'>
            {prog.career.map((c) => (
              <span
                key={c}
                className='bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold text-dark dark:text-white'
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProgrammesPage() {
  return (
    <main className='py-24 px-6 max-w-6xl mx-auto'>
      <h1 className='text-5xl font-bold mb-16 text-center text-dark dark:text-white'>
        Available Programmes
      </h1>

      {/* Programmes Grid */}
      <div className='grid lg:grid-cols-2 gap-8 mb-24'>
        {PROGRAMME_DATA.map((prog) => (
          <ProgrammeCard key={prog.name} prog={prog} />
        ))}
      </div>

      {/* Learning Process */}
      <section className='mb-24'>
        <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
          Our Learning Process
        </h2>
        <div className='flex flex-col items-center gap-2 max-w-lg mx-auto'>
          {[
            'Enroll',
            'Attend Classes',
            'Weekly Assessments',
            'Standalone Project',
            'Project Defense',
            'Proceed to Next Level',
            'Final Capstone Project',
            'Graduation',
            'Certificate',
          ].map((step, i) => (
            <div key={i} className='text-center'>
              <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-full font-medium text-dark dark:text-white shadow-sm'>
                {step}
              </div>
              {i < 8 && (
                <div className='h-8 w-px bg-gray-300 dark:bg-gray-700 mx-auto my-1'></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Policy & Graduation */}
      <div className='grid md:grid-cols-2 gap-12 mb-24'>
        <div className='p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
          <h3 className='text-2xl font-bold mb-6 flex items-center gap-2 text-dark dark:text-white'>
            <BookOpen className='text-primary-purple' /> Assessment Policy
          </h3>
          <p className='text-gray-600 dark:text-gray-300'>
            Students must score at least 70% in every standalone project to
            progress. If you don't meet the requirement, you will repeat and
            improve your project to ensure you truly master the skill.
          </p>
        </div>

        <div className='p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
          <h3 className='text-2xl font-bold mb-6 flex items-center gap-2 text-dark dark:text-white'>
            <GraduationCap className='text-primary-red' /> Graduation
            Requirements
          </h3>
          <ul className='space-y-3 text-gray-600 dark:text-gray-300'>
            {[
              'Complete all modules',
              'Pass every milestone',
              'Minimum 70% average score',
              'Capstone project completion',
              'Satisfactory attendance',
            ].map((req) => (
              <li key={req} className='flex items-center gap-2'>
                <CheckCircle2
                  size={18}
                  className='text-primary-purple flex-shrink-0'
                />{' '}
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Class Models */}
      <section className='text-center'>
        <h3 className='text-2xl font-bold mb-8 flex justify-center items-center gap-2 text-dark dark:text-white'>
          <Calendar className='text-primary-purple' /> Flexible Learning Models
        </h3>
        <div className='flex flex-wrap justify-center gap-4'>
          {['Online', 'Physical', 'Weekend', 'Recorded'].map((model) => (
            <span
              key={model}
              className='bg-primary-purple/10 text-primary-purple px-6 py-3 rounded-full font-semibold'
            >
              {model} Classes
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
