import { Request } from 'express';

export function getClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    const ip = xff.split(',')[0]?.trim();
    if (ip) return normalizeIp(ip);
  }
  if (Array.isArray(xff) && xff.length > 0) {
    const ip = xff[0]?.split(',')[0]?.trim();
    if (ip) return normalizeIp(ip);
  }
  const raw = req.socket.remoteAddress || '';
  return normalizeIp(raw);
}

function normalizeIp(ip: string): string {
  if (ip.startsWith('::ffff:')) return ip.substring(7);
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

