export function formatRelativeTime(timestamp, type) {
  const now: any = new Date();
  const date: any = new Date(timestamp);

  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (type == "comments")
    if (days > 0) {
      return `${days} d`;
    } else if (hours > 0) {
      return `${hours} h`;
    } else if (minutes > 0) {
      return `${minutes} m`;
    } else {
      return `${seconds} s`;
    }

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
}
