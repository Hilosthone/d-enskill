import {
  FaLaptopCode,
  FaUserGraduate,
  FaCertificate,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaUsers,
} from 'react-icons/fa'

const reasons = [
  { icon: FaProjectDiagram, title: 'Real-life Projects' },
  { icon: FaLaptopCode, title: 'Industry Curriculum' },
  { icon: FaUserGraduate, title: 'Experienced Mentors' },
  { icon: FaUsers, title: 'Online & Physical Classes' },
  { icon: FaMoneyBillWave, title: 'Flexible Payment' },
  { icon: FaCertificate, title: 'Certificate Upon Graduation' },
]

export default function WhyChooseUs() {
  return (
    <section className='py-24 px-6 bg-gray-light dark:bg-gray-950 rounded-[4rem]'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16' data-aos='fade-up'>
          <h2 className='text-4xl md:text-5xl font-bold text-dark dark:text-white tracking-tight'>
            Why Choose <span className='text-dark dark:text-white'>D</span>{' '}
            <span className='text-primary-red'>Enskill</span> ???
          </h2>
          <p className='mt-4 text-lg text-dark/70 dark:text-white/70 max-w-2xl mx-auto'>
            Practical skills, professional support, and a pathway to a thriving
            tech career.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-light dark:border-gray-800 shadow-sm flex items-start gap-6 hover:border-primary-purple/30 dark:hover:border-primary-purple/30 transition-all hover:-translate-y-1'
              data-aos='fade-up'
              data-aos-delay={index * 100}
            >
              <div className='p-3.5 bg-primary-purple/10 dark:bg-primary-purple/20 rounded-xl text-primary-purple text-2xl'>
                <reason.icon />
              </div>
              <h3 className='text-xl font-semibold text-dark dark:text-white mt-1.5'>
                {reason.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
