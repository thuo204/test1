const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const key = identifier;

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  current.count++;
  return { success: true, remaining: maxRequests - current.count };
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}
