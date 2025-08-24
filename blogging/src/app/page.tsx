import Navbar from '@/Components/Navbar'
import Blogs from '../../Pages/Blogs'
import Footer from '@/Components/Footer'
import ContactUs from '@/Components/ContactUs'
// import { FaArrowDown } from 'react-icons/fa'
import Weather from '@/Components/Weather'
import DetectAdblocker from '@/Components/DetectAdblocker'

const Page = () => {
  return (
    <DetectAdblocker>
      <main>
        <Navbar />
        <section className='hero flex items-center md:items-start h-96 md:h-screen pl-4 mb-4 rounded-tl-2xl rounded-tr-2xl'>
          <div className='w-full'>
            <p className='text-white text-4xl md:text-9xl font-bold italic pt-5'>
              “Go where you
              feel <br /> most 
              <span className='text-[#F04952]'> alive.</span>
            </p>
            <p className='text-white text-md md:text-2xl mt-4 font-light tracking-wide'>
              Discover stories that spark your next adventure
            </p>
            <div className='mt-6'>
                <button className='flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-[#F04952] text-white font-semibold rounded-md shadow transition'>
                  <a href="#blogs">Explore</a>
                </button>
            </div>
          </div>
        </section>
        {/* <Weather /> */}
        <Blogs />
        <ContactUs />
        <Footer />
      </main>
    </DetectAdblocker>
  )
}

export default Page
