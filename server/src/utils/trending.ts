export interface TrendingFactors {
  views: number;
  likes: number;
  saves: number;
  shares: number;
  comments: number;
  publishedAt: Date;
}

export function calculateTrendingScore(factors: TrendingFactors): number {
  const { views, likes, saves, shares, comments, publishedAt } = factors;

  const now = new Date().getTime();
  const publishedTime = new Date(publishedAt).getTime();
  const ageInHours = Math.max(0, (now - publishedTime) / (1000 * 60 * 60));

  const weightedInteractions =
    views * 1.0 +
    likes * 2.5 +
    saves * 3.0 +
    shares * 3.5 +
    comments * 2.0;

  // Real decay formula over time
  const decay = Math.pow(ageInHours + 2, 1.5);
  const score = (weightedInteractions / decay) * 10;

  return Math.round(score * 100) / 100;
}
