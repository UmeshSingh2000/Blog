import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.potatotrail.life';

    // 1) Static routes — home, blogs list, contact etc.
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }
    ];

    // 2) Dynamic routes — fetch blog slugs from your backend
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBlogs`, {
            // optionally set cache settings
            next: { revalidate: 3600 }
        });
        if (res.ok) {
            const data = await res.json();
            const blogs = data.blogs || [];
            blogRoutes = blogs.map((blog: any) => ({
                url: `${baseUrl}/blog/${blog.slug}`,  // adjust path if you use /blogs/slug or /post/slug
                llastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            }));
        }
    } catch (err) {
        console.error('Error generating sitemap:', err);
    }

    return [
        ...staticRoutes,
        ...blogRoutes
    ];
}
