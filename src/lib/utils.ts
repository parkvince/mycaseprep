export function formatScore(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Competent";
  if (score >= 60) return "Developing";
  return "Needs Work";
}

export function formatScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#84cc16";
  if (score >= 70) return "#eab308";
  if (score >= 60) return "#f97316";
  return "#ef4444";
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getCaseTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    market_sizing: "Market Sizing",
    profitability: "Profitability",
    market_entry: "Market Entry",
    merger_acquisition: "M&A",
    operations: "Operations",
    random: "Random",
  };
  return labels[type] ?? type;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: "#22c55e",
    intermediate: "#eab308",
    advanced: "#ef4444",
  };
  return colors[difficulty] ?? "#94a3b8";
}

export function calculatePercentile(score: number): string {
  if (score >= 90) return "top 5%";
  if (score >= 80) return "top 15%";
  if (score >= 70) return "top 30%";
  if (score >= 60) return "top 50%";
  return "bottom 50%";
}