import type { NewsArticle } from "@shared/schema";

// Very small TF-IDF + cosine similarity implementation for ~30 docs

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function termFreq(tokens: string[]) {
  const tf: Record<string, number> = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  return tf;
}

function buildIdf(docsTokens: string[][]) {
  const df: Record<string, number> = {};
  for (const tokens of docsTokens) {
    const seen = new Set<string>();
    for (const t of tokens) {
      if (!seen.has(t)) {
        df[t] = (df[t] || 0) + 1;
        seen.add(t);
      }
    }
  }
  const idf: Record<string, number> = {};
  const N = docsTokens.length;
  for (const term in df) {
    idf[term] = Math.log((N + 1) / (df[term] + 1)) + 1; // smoothed idf
  }
  return idf;
}

function vectorize(tf: Record<string, number>, idf: Record<string, number>) {
  const vec: Record<string, number> = {};
  for (const term in tf) {
    vec[term] = (tf[term] || 0) * (idf[term] || 0);
  }
  return vec;
}

function dot(a: Record<string, number>, b: Record<string, number>) {
  let s = 0;
  for (const k in a) {
    if (b[k]) s += a[k] * b[k];
  }
  return s;
}

function norm(a: Record<string, number>) {
  let s = 0;
  for (const k in a) s += a[k] * a[k];
  return Math.sqrt(s);
}

export function rankArticlesBySemanticSimilarity(articles: NewsArticle[], query: string) {
  const docs = articles.map(a => `${a.title} ${a.description || ""} ${a.content || ""}`);
  const docsTokens = docs.map(d => tokenize(d));
  const idf = buildIdf(docsTokens);
  const docVectors = docsTokens.map(tokens => vectorize(termFreq(tokens), idf));

  const qTokens = tokenize(query);
  const qTf = termFreq(qTokens);
  const qVec = vectorize(qTf, idf);

  const qNorm = norm(qVec) || 1;

  const scored = articles.map((article, idx) => {
    const v = docVectors[idx];
    const score = (dot(v, qVec) || 0) / ( (norm(v) || 1) * qNorm );
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.article);
}
