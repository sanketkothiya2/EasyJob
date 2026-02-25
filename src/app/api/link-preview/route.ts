import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to extract meta tags from HTML
function extractMetaTags(html: string, baseUrl: string) {
  const getMetaContent = (name: string): string | null => {
    // Try property first (og:tags)
    const propertyMatch = html.match(new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'));
    if (propertyMatch) return propertyMatch[1];
    
    // Try name attribute
    const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'));
    if (nameMatch) return nameMatch[1];
    
    // Try reversed order (content before property/name)
    const reversedMatch = html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`, 'i'));
    if (reversedMatch) return reversedMatch[1];
    
    return null;
  };

  // Extract title
  let title = getMetaContent('og:title') || getMetaContent('twitter:title');
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    title = titleMatch ? titleMatch[1].trim() : null;
  }

  // Extract description
  const description = getMetaContent('og:description') || 
                     getMetaContent('twitter:description') || 
                     getMetaContent('description');

  // Extract image
  let thumbnail = getMetaContent('og:image') || 
                  getMetaContent('twitter:image') || 
                  getMetaContent('twitter:image:src');
  
  // Make relative URLs absolute
  if (thumbnail && !thumbnail.startsWith('http')) {
    try {
      thumbnail = new URL(thumbnail, baseUrl).href;
    } catch {
      thumbnail = null;
    }
  }

  // Extract site name
  const siteName = getMetaContent('og:site_name') || 
                   getMetaContent('application-name');

  // Extract favicon
  let favicon = null;
  const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i);
  if (faviconMatch) {
    favicon = faviconMatch[1];
    if (!favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, baseUrl).href;
      } catch {
        favicon = null;
      }
    }
  }
  if (!favicon) {
    try {
      favicon = new URL('/favicon.ico', baseUrl).href;
    } catch {
      favicon = null;
    }
  }

  return { title, description, thumbnail, siteName, favicon };
}

// POST - Fetch link preview metadata
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the page
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(parsedUrl.href, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EasyJob/1.0; Link Preview)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          preview: {
            url: parsedUrl.href,
            title: parsedUrl.hostname,
            description: null,
            thumbnail: null,
            siteName: parsedUrl.hostname,
            favicon: `${parsedUrl.origin}/favicon.ico`,
          },
        });
      }

      const html = await response.text();
      const metadata = extractMetaTags(html, parsedUrl.origin);

      return NextResponse.json({
        preview: {
          url: parsedUrl.href,
          title: metadata.title || parsedUrl.hostname,
          description: metadata.description,
          thumbnail: metadata.thumbnail,
          siteName: metadata.siteName || parsedUrl.hostname,
          favicon: metadata.favicon,
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      // Return basic info on fetch failure
      return NextResponse.json({
        preview: {
          url: parsedUrl.href,
          title: parsedUrl.hostname,
          description: null,
          thumbnail: null,
          siteName: parsedUrl.hostname,
          favicon: `${parsedUrl.origin}/favicon.ico`,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return NextResponse.json({ error: 'Failed to fetch link preview' }, { status: 500 });
  }
}
