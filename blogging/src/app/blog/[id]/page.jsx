import Footer from '@/Components/Footer'
import MarkdownRenderer from '@/Components/MarkdownRenderer'
import Navbar from '@/Components/Navbar'
import { notFound } from 'next/navigation'

export default async function BlogDetailPage({ params }) {
  const id = params.id

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getblog/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) return notFound()

  const { blog } = await res.json()

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-600 mb-6 text-sm">By {blog.author?.name}</p>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="rounded-xl w-full h-auto mb-8"
        />

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {blog.content.map((block, idx) => {
            if (block.type === 'content') {
              return <MarkdownRenderer key={idx} content={block.value} />
            } else if (block.type === 'image') {
              return (
                <figure key={idx} className="my-6">
                  <img
                    src={block.value}
                    alt={`Blog Image ${idx + 1}`}
                    className="rounded-xl w-full h-auto"
                  />
                  {block.subtitle && (
                    <figcaption className="mt-2 text-center text-gray-500 text-sm italic">
                      {block.subtitle}
                    </figcaption>
                  )}
                </figure>
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}
