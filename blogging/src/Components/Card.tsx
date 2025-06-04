import React from 'react'
import Image from 'next/image';
import img from '../../public/image 5.png'

const Card = () => {
    return (
        <div className="max-w-sm rounded-xl overflow-hidden shadow bg-white mt-2">
            <Image
                src={img}
                alt="Waterfall"
                className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Chasing Waterfalls in the Western Ghats
                </h2>
                <p className="text-gray-600 italic mt-1">
                    Lose yourself in the roar of nature and the silence of the forest trails.
                </p>
                <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center mt-4">
                        <img
                            className="w-9 h-9 rounded-full object-cover"
                            src="https://i.pravatar.cc/150?img=32"
                            alt="Author"
                        />
                        <p className="ml-2 text-sm text-gray-700 font-medium">Lalit Singh Mehta</p>
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Nature</span>
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Water fall</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Card
