import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  let pkg: any = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/get-package/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      pkg = await res.json();
    }
  } catch (e) {
    // fallback to generic metadata
  }

  const title = pkg?.title
    ? `${pkg.title} • Himalayan Expedition | Pahadi Basera`
    : `${slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} • Expedition | Pahadi Basera`;

  const description = pkg?.description || pkg?.longDescription
    ? `${pkg.description || pkg.longDescription} (Altitude: ${pkg.altitude || '3,000m'} • ${pkg.duration || 'Multi-day'}). Verified mountain guides and luxury basecamps.`
    : `Experience raw, authentic Himalayan slow travel and expeditions in ${slug.replace(/-/g, ' ')}. Book verified stays with Pahadi Basera.`;

  const imageUrl =
    pkg?.image ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pahadibasera.com/packages/${slug}`,
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

export default function PackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
