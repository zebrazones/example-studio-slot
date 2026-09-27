export function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function groupByDay<T extends { startsAt: Date }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.startsAt.toDateString();
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.values()];
}
