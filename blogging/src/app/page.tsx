

import Footer from '@/Components/Footer'

// import { FaArrowDown } from 'react-icons/fa'

import DetectAdblocker from '@/Components/DetectAdblocker'
import HomePage from '../Components/HomePage'


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
        <Footer />
      </main>
    </DetectAdblocker>
  )
}

export default Page
