import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      nodes: { online: 4, total: 5, latency: Math.floor(Math.random() * 20 + 12) },
      cfu: { total: 258, base: 100 },
      tasks: { today: Math.floor(Math.random() * 30 + 85), successRate: 97.8, running: 2, pending: 1 },
      latency: Math.floor(Math.random() * 20 + 12),
    },
  });
}
