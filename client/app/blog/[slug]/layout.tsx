import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  let blog: any = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      blog = await res.json();
    }
  } catch (e) {
    // fallback
  }

  const title = blog?.title
    ? `${blog.title} | Himalayan Field Dispatch`
    : `Mountain Dispatch | Pahadi Basera`;

  const description =
    blog?.excerpt || blog?.content
      ? `${(blog.excerpt || blog.content).slice(0, 150)}... Altitude: ${
          blog.altitude || '2,400m'
        }. Logged on Pahadi Basera.`
      : `Read authentic high-altitude journals, route dispatches, and local wisdom from Pahadi Basera.`;

  const imageUrl =
    Array.isArray(blog?.images) && blog.images.length > 0
      ? blog.images[0]
      : 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pahadibasera.com/blog/${slug}`,
      siteName: 'Pahadi Basera',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
