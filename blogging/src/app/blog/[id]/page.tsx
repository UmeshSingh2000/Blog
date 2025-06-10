// app/blogs/[id]/page.tsx
import Navbar from '@/Components/Navbar';
import { notFound } from 'next/navigation';

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
            <div className="p-4">
                <h1 className="text-3xl font-bold">{blog.title}</h1>
                <p className="text-gray-600">By {blog.author.name}</p>
                <img src={blog.coverImage} alt={blog.title} className="my-4 rounded-lg" />
                <div className="prose">
                    {blog.content.map((block: any, idx: number) => (
                        <p key={idx}>{block.value}</p>
                    ))}
                </div>
            </div>
        </>
    );
}
