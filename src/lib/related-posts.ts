import type { CollectionEntry } from 'astro:content';
import {
  getPostDate,
  getPostId,
  getPostSection,
  getPostTags,
  normalizeTags
} from './posts';

type PostEntry = CollectionEntry<'posts'> & { _date?: Date | null };

export type RecommendedPost = {
  kind: 'related' | 'distant';
  post: PostEntry;
  score: number;
};

type ScoredPost = {
  post: PostEntry;
  score: number;
  semanticScore: number;
  publishedTime: number;
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function toSet(values: string[]) {
  return new Set(values.map(normalizeKey).filter(Boolean));
}

function countIntersection(left: Set<string>, right: Set<string>) {
  let count = 0;
  for (const item of left) {
    if (right.has(item)) count += 1;
  }
  return count;
}

function tokenizeText(value: unknown) {
  const text = String(value || '').toLowerCase();
  const tokens = new Set<string>();

  for (const match of text.matchAll(/[a-z0-9][a-z0-9_-]{1,}/g)) {
    tokens.add(match[0]);
  }

  for (const match of text.matchAll(/\p{Script=Han}{2,}/gu)) {
    const chunk = match[0];
    if (chunk.length <= 4) {
      tokens.add(chunk);
      continue;
    }

    for (let index = 0; index < chunk.length - 1; index += 1) {
      tokens.add(chunk.slice(index, index + 2));
    }
  }

  return tokens;
}

function getTextTokens(post: PostEntry) {
  const data = post.data as Record<string, unknown>;
  return tokenizeText([data.title, data.excerpt].filter(Boolean).join(' '));
}

function getKeywords(post: PostEntry) {
  return normalizeTags((post.data as Record<string, unknown>).keywords);
}

function getParentPath(post: PostEntry) {
  const id = getPostId(post);
  const parts = id.split('/');
  parts.pop();
  return parts.join('/');
}

function getPublishedTime(post: PostEntry) {
  const date = post._date || getPostDate(post);
  return date ? date.getTime() : 0;
}

function scorePost(current: PostEntry, candidate: PostEntry): ScoredPost {
  const sharedTags = countIntersection(toSet(getPostTags(current)), toSet(getPostTags(candidate)));
  const sharedKeywords = countIntersection(toSet(getKeywords(current)), toSet(getKeywords(candidate)));
  const sharedTokens = countIntersection(getTextTokens(current), getTextTokens(candidate));
  const sameParent = getParentPath(current) === getParentPath(candidate);
  const sameSection = getPostSection(current) === getPostSection(candidate);

  const semanticScore = sharedTags * 80 + sharedKeywords * 35 + sharedTokens * 8;
  const score = semanticScore + (sameParent ? 6 : 0) + (sameSection ? 3 : 0);

  return {
    post: candidate,
    score,
    semanticScore,
    publishedTime: getPublishedTime(candidate)
  };
}

function sortByStrength(left: ScoredPost, right: ScoredPost) {
  if (right.score !== left.score) return right.score - left.score;
  if (right.semanticScore !== left.semanticScore) return right.semanticScore - left.semanticScore;
  if (right.publishedTime !== left.publishedTime) return right.publishedTime - left.publishedTime;
  return getPostId(left.post).localeCompare(getPostId(right.post), 'zh-CN');
}

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickDistantPost(current: PostEntry, candidates: ScoredPost[]) {
  const currentSection = getPostSection(current);
  const semanticDistant = candidates.filter((item) => item.semanticScore === 0);
  const distantPool = semanticDistant.length ? semanticDistant : candidates.sort((left, right) => {
    if (left.semanticScore !== right.semanticScore) return left.semanticScore - right.semanticScore;
    return left.score - right.score;
  });

  const differentSection = distantPool.filter((item) => getPostSection(item.post) !== currentSection);
  const pool = differentSection.length ? differentSection : distantPool;
  if (!pool.length) return null;

  const sortedPool = [...pool].sort((left, right) =>
    getPostId(left.post).localeCompare(getPostId(right.post), 'zh-CN')
  );
  return sortedPool[stableHash(getPostId(current)) % sortedPool.length];
}

export function getRecommendedPosts(
  current: PostEntry,
  posts: PostEntry[],
  relatedLimit = 2
): RecommendedPost[] {
  const currentId = getPostId(current);
  const scored = posts
    .filter((post) => getPostId(post) !== currentId)
    .map((post) => scorePost(current, post));

  const related = [...scored].sort(sortByStrength).slice(0, relatedLimit);
  const relatedIds = new Set(related.map((item) => getPostId(item.post)));
  const distant = pickDistantPost(
    current,
    scored.filter((item) => !relatedIds.has(getPostId(item.post)))
  );

  return [
    ...related.map((item) => ({ kind: 'related' as const, post: item.post, score: item.score })),
    ...(distant ? [{ kind: 'distant' as const, post: distant.post, score: distant.score }] : [])
  ];
}
