import React from 'react'
import Image from 'next/image';
import defaultUser from '../../public/default User.png'

interface Blog {
  title: string;
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  excerpt: string;
  coverImage: string;
}
interface CardProps {
    blog: Blog;
}
const Card: React.FC<CardProps> = ({blog}) => {
    return (
        <div className="max-w-sm rounded-xl overflow-hidden shadow bg-white mt-2 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <Image
                src={blog.coverImage || defaultUser}
                alt="Waterfall"
                className="w-full h-56 object-cover rounded-t-xl"
                width={500}
                height={300}
            />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {blog.title}
                </h2>
                <p className="text-gray-600 italic mt-1">
                    {blog.excerpt}
                </p>
                <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center mt-4">
                        <Image
                            className="w-9 h-9 rounded-full object-cover"
                            src={defaultUser}
                            alt="Cover Image"
                            width={36}
                            height={36}
                            />
                        <p className="ml-2 text-sm text-gray-700 font-medium">{blog.author.name}</p>
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
