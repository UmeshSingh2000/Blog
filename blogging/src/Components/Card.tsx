import React from 'react'
import Image from 'next/image'
import defaultUser from '../../public/default User.png'

interface Blog {
  title: string
  _id: string
  author: {
    _id: string
    name: string
    email: string
  }
  tags: {
    _id: string
    name: string
  }[]
  excerpt: string
  coverImage: string
}

interface CardProps {
  blog: Blog
}

const Card: React.FC<CardProps> = ({ blog }) => {
  const hasMoreTags = blog.tags && blog.tags.length > 2
  const visibleTags = blog.tags?.slice(0, 2) || []
  const hiddenTags = hasMoreTags ? blog.tags?.slice(2) : []

  return (
    <div className="group max-w-sm rounded-xl overflow-hidden shadow bg-white mt-2 cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="overflow-hidden"> {/* Ensure image stays within bounds when zooming */}
        <Image
          src={blog.coverImage || defaultUser}
          alt="Blog cover"
          className="w-full h-56 object-cover rounded-t-xl transform transition-transform duration-300 group-hover:scale-105"
          width={500}
          height={300}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">
          {blog.title}
        </h2>
        <p className="text-gray-600 italic mt-1">
          {blog.excerpt}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 gap-2">
          <div className="flex items-center">
            <Image
              className="w-9 h-9 rounded-full object-cover"
              src={defaultUser}
              alt="Author avatar"
              width={36}
              height={36}
            />
            <p className="ml-2 text-sm text-gray-700 font-medium">{blog.author.name}</p>
          </div>

          <div className="relative group/tag min-w-0">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 w-full">
                {visibleTags.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full truncate max-w-[120px]"
                    title={tag.name}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {hasMoreTags && (
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    title={`Tags: ${hiddenTags.map(t => t.name).join(', ')}`}
                  >
                    +{hiddenTags.length} more
                  </span>
                </div>
              )}
            </div>

            {hasMoreTags && (
              <div className="absolute hidden group-hover/tag:flex flex-col gap-2 bottom-full mb-2 right-0 z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px] max-w-[240px]">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {hiddenTags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full truncate w-full"
                      title={tag.name}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Card