import Navbar from '@/Components/Navbar'
import Blogs from '../../Pages/Blogs'
import Footer from '@/Components/Footer'
import ContactUs from '@/Components/ContactUs'
// import { FaArrowDown } from 'react-icons/fa'
import Weather from '@/Components/Weather'
import DetectAdblocker from '@/Components/DetectAdblocker'
import HomePage from '@/Components/HomePage'

const Page = () => {
  return (
    <DetectAdblocker>
      <main>
        <Navbar />
        <HomePage/>
        {/* <Weather /> */}
        <Blogs />
        <ContactUs />
        <Footer />
      </main>
    </DetectAdblocker>
  )
}

export default Page
