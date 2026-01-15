

import Footer from '@/Components/Footer'

// import { FaArrowDown } from 'react-icons/fa'

import DetectAdblocker from '@/Components/DetectAdblocker'
import HomePage from '../Components/HomePage'


import RecentArticles from '@/Components/RecentArticles'
import UsersList from '@/Components/UsersList'



const Page = async () => {
  const blogs = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBlogs?limit=8`)
  const blogsData = await blogs.json()
  return (
    <DetectAdblocker>
      <main>
        {/* <Navbar /> */}
        <HomePage />
        <RecentArticles blogs={blogsData.blogs} />
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
