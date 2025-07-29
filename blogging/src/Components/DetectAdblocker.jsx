'use client'
import { useEffect, useState } from 'react'

const DetectAdblocker = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const bait = document.createElement('div')
    bait.className = 'adsbox ad ad-banner ad-slot adsbygoogle'
    bait.style.cssText = 'width:1px;height:1px;position:absolute;top:-1000px;'
    document.body.appendChild(bait)

    setTimeout(() => {
      const isHidden =
        !bait ||
        bait.offsetHeight === 0 ||
        bait.clientHeight === 0 ||
        getComputedStyle(bait).display === 'none' ||
        getComputedStyle(bait).visibility === 'hidden'

      if (isHidden) setIsBlocked(true)

      document.body.removeChild(bait)
      setChecked(true)
    }, 200)
  }, [])

  if (!checked) return null // Prevent flash of content

  if (isBlocked) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-red-500 text-3xl md:text-5xl font-bold mb-4">
            🚫 Ad Blocker Detected
          </h1>
          <p className="text-white text-lg md:text-2xl">
            Please disable your ad blocker to access this website. <br />
            Ads help us keep this platform free.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default DetectAdblocker
