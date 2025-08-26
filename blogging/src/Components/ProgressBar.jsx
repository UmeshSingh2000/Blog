'use client'

import { useEffect, useState } from 'react'

export default function ProgressBar() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / totalHeight) * 100
      setScroll(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-[55px] left-0 w-full h-1 z-40 bg-gray-200">
      <div
        className="h-full bg-[#F04952] transition-all duration-300 ease-linear"
        style={{ width: `${scroll}%` }}
      />
    </div>
  )
}
