import { getPostHref, getPostTags, loadPosts, normalizeTags } from '../lib/posts';

export async function GET() {
  const posts = await loadPosts();
  const searchItems = posts.map((post) => ({
    title: post.data.title || post.id,
    href: getPostHref(post),
    excerpt: post.data.excerpt || '',
    content: (post as { body?: string }).body || '',
    tags: getPostTags(post),
    keywords: normalizeTags(post.data.keywords)
  }));

  return new Response(JSON.stringify(searchItems), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
}
