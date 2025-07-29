'use client'
import { useEffect, useState } from 'react'

const DetectAdblocker = () => {
    const [adBlockerDetected, setAdBlockerDetected] = useState(false)

    useEffect(() => {
        // Create bait div
        const bait = document.createElement('div')
        bait.setAttribute('class', 'adsbox ad-banner ad-banner-top ad-unit ad-slot adsbygoogle')
        bait.setAttribute('style', 'width: 1px; height: 1px; position: absolute; top: -1000px;')
        document.body.appendChild(bait)

        // Give ad blocker time to hide it
        setTimeout(() => {
            const isBlocked =
                !bait ||
                bait.offsetParent === null ||
                bait.offsetHeight === 0 ||
                bait.clientHeight === 0 ||
                getComputedStyle(bait).display === 'none' ||
                getComputedStyle(bait).visibility === 'hidden'

            if (isBlocked) {
                setAdBlockerDetected(true)
            }

            document.body.removeChild(bait)
        }, 200)
    }, [])

    return (
        <div className="p-4">
            {adBlockerDetected ? (
                <div className="text-red-500 font-bold">
                    🚫 Ad Blocker Detected. Please disable it to support our site.
                </div>
            ) : (
                <div className="text-green-600 font-bold">
                    ✅ No Ad Blocker Detected. Thanks for your support!
                </div>
            )}
        </div>
    )
}

export default DetectAdblocker
