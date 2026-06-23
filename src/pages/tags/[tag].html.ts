import { redirectResponse } from '../../lib/redirect-response';
import { getAllTags, loadPosts } from '../../lib/posts';

export async function getStaticPaths() {
  const currentTags = getAllTags(await loadPosts());
  const currentSlugs = new Set(currentTags.map((tag) => tag.slug));

  return Array.from(currentSlugs).map((slug) => ({
    params: { tag: slug },
    props: {
      destination: `/tags/${slug}/`,
      label: `#${slug}`
    }
  }));
}

export function GET({ props }: { props: { destination: string; label: string } }) {
  return redirectResponse(props.destination, 'Tag', props.label);
}
