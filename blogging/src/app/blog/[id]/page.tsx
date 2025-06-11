// app/blogs/[id]/page.tsx
import Navbar from '@/Components/Navbar';
import { notFound } from 'next/navigation';
import ReactMarkdown from "react-markdown";

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getblog/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return notFound();

    const { blog } = await res.json();

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
                <p className="text-gray-600 mb-6 text-sm">By {blog.author.name}</p>
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="rounded-xl w-full h-auto mb-8"
                />

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {blog.content.map((block: any, idx: number) => {
                        if (block.type === 'content') {
                            return (
                                
                                <ReactMarkdown key={idx}>{block.value}</ReactMarkdown>

                            );
                        } else if (block.type === 'image') {
                            return (
                                <img
                                    key={idx}
                                    src={block.value}
                                    alt={`Blog Image ${idx + 1}`}
                                    className="rounded-xl my-6"
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
        </>
    );
}
