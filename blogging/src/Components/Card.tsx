import React from 'react'
import Image from 'next/image'
import defaultUser from '../../public/default User.png'
import Link from 'next/link'

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
  views: number,
  slug: string
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
    <article className="relative bg-white h-full flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={coverImageUrl}
          alt="Blog cover"
          className="w-full h-48 object-cover"
          width={500}
          height={300}
          unoptimized
        />

        {hasMoreTags && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-[#F04952] backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
              <span className="text-xs font-medium text-white">
                +{hiddenTags.length} tags
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-2">
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {visibleTags.map((tag, index) => (
            <span
              key={tag._id}
              className={`px-3 py-1.5 text-xs font-medium rounded-full
            ${index === 0
                  ? 'bg-blue-50 text-[#F04952]'
                  : 'bg-gray-50 text-gray-600'}
          `}
            >
              {tag.name}
            </span>
          ))}

          {hasMoreTags && (
            <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
              +{hiddenTags.length} more
            </span>
          )}
        </div>

        {/* Footer (Author + Read & Views) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Image
              className="w-10 h-10 rounded-full object-cover"
              src={blog.author.profilePicture || defaultUser}
              alt="Author avatar"
              width={40}
              height={40}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {blog.author.name}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          {/* Read & Views */}
          <div className="flex flex-col items-end text-sm text-gray-600 space-y-1">
            <Link href={`/blog/${blog.slug}`} className="text-decoration-none">
              <div className="flex items-center">
                <span className="mr-1 font-medium text-[#F04952]">Read</span>
                <svg className="w-4 h-4 text-[#F04952]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <div className="flex items-center text-xs text-gray-500">
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
