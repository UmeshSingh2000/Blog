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
    profilePicture?: string
  }
  tags: {
    _id: string
    name: string
  }[]
  excerpt: string
  coverImage: {
    url: string
    subtitle: string
  }
  views: number
}

interface CardProps {
  blog: Blog
}

const Card: React.FC<CardProps> = ({ blog }) => {
  const hasMoreTags = blog.tags && blog.tags.length > 2
  const visibleTags = blog.tags?.slice(0, 2) || []
  const hiddenTags = hasMoreTags ? blog.tags?.slice(2) : []
  const coverImageUrl =
    typeof blog.coverImage === 'string' ? blog.coverImage : blog.coverImage.url || ''

  return (
    <article className="group relative max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-gray-200">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Image
          src={coverImageUrl}
          alt="Blog cover"
          className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
          width={500}
          height={300}
        />

        {hasMoreTags && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
              <span className="text-xs font-medium text-gray-700">
                +{hiddenTags.length} tags
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {blog.title}
        </h2>

        <div className="overflow-hidden transition-all duration-300 max-h-20 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-20 md:group-hover:opacity-100">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
            {blog.excerpt}
          </p>
        </div>

        <div className="relative transition-all duration-300 max-h-20 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-20 md:group-hover:opacity-100">
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag, index) => (
              <span
                key={tag._id}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300
                  ${index === 0
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                  hover:scale-105 cursor-pointer
                `}
                title={tag.name}
              >
                {tag.name}
              </span>
            ))}

            {hasMoreTags && (
              <div className="relative group/tooltip">
                <span className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full hover:from-gray-100 hover:to-gray-150 transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
                  +{hiddenTags.length} more
                </span>

                {/* Tooltip */}
                <div className="invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 transition-all duration-300">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-xs whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {hiddenTags.map((tag, index) => (
                        <span key={tag._id}>
                          {tag.name}{index < hiddenTags.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Author + Read & Views */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                className="w-10 h-10 rounded-full object-cover"
                src={blog.author.profilePicture || defaultUser}
                alt="Author avatar"
                width={40}
                height={40}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                {blog.author.name}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          {/* Read & Views */}
          <div className="flex flex-col items-end text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 space-y-1 text-sm">
            {/* Read */}
            <div className="flex items-center">
              <span className="mr-1 font-medium">Read</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Views */}
            <div className="flex items-center text-gray-500 text-xs">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
              </svg>
              {blog.views} views
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Card
