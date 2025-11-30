import Navbar from '@/Components/Navbar'
import Blogs from '../../Pages/Blogs'
import Footer from '@/Components/Footer'
import ContactUs from '@/Components/ContactUs'
// import { FaArrowDown } from 'react-icons/fa'
import Weather from '@/Components/Weather'
import DetectAdblocker from '@/Components/DetectAdblocker'
import HomePage from '../../Pages/HomePage'
import About from '../../Pages/About'
import PopularBlogs from '../../Pages/PopularBlogs'
import RecentArticles from '@/Components/RecentArticles'
import UsersList from '@/Components/UsersList'


const Page = () => {
  return (
    <DetectAdblocker>
      <main>
        {/* <Navbar /> */}
        <HomePage />
        <RecentArticles />
        <UsersList />
        {/* <About />
        <PopularBlogs />

        <ContactUs /> */}

      </main>
    </DetectAdblocker>
  )
}

export default Page
