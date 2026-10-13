import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const NODES = [
  { id: 'NODE_001', name: '油田-边缘节点#1', hw: 'RTX 3090', cfu: 115, status: 'online', cpu: 38, mem: 55, net: 18, score: 96 },
  { id: 'NODE_002', name: '油田-边缘节点#2', hw: 'Jetson AGX', cfu: 42, status: 'online', cpu: 52, mem: 48, net: 22, score: 84 },
  { id: 'NODE_003', name: '油田-边缘节点#3', hw: 'Atlas 200', cfu: 35, status: 'busy', cpu: 81, mem: 76, net: 25, score: 71 },
  { id: 'NODE_004', name: '油田-边缘节点#4', hw: 'Jetson Nano', cfu: 8, status: 'online', cpu: 22, mem: 35, net: 30, score: 63 },
  { id: 'NODE_005', name: '备用-边缘节点#5', hw: 'RTX 3080', cfu: 100, status: 'offline', cpu: 0, mem: 0, net: 0, score: 0 },
];
export async function GET() {
  const updated = NODES.map(n => {
    if (n.status === 'offline') return n;
    return { ...n, cpu: Math.max(5, Math.min(95, n.cpu + Math.floor(Math.random() * 10 - 3))), mem: Math.max(10, Math.min(95, n.mem + Math.floor(Math.random() * 6 - 2))), net: Math.max(5, Math.min(80, n.net + Math.floor(Math.random() * 8 - 3))), score: Math.max(50, Math.min(100, n.score + Math.floor(Math.random() * 6 - 2))) };
  });
  return NextResponse.json({ success: true, timestamp: new Date().toISOString(), nodes: updated });
}
