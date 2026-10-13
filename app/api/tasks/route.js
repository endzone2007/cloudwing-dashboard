import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const TYPES = [
  { name: '油田地震数据异常区域推理', icon: '🛢' },
  { name: '矿山点云分割（PointNet）', icon: '⛏' },
  { name: '地质建模数据处理', icon: '🔬' },
  { name: '图像分类（Mobilenet）', icon: '📷' },
  { name: '目标检测（YOLOv8）', icon: '🎯' },
  { name: '传感器数据融合分析', icon: '⚡' },
];
const SUBMITTERS = ['张世沛', '陈麒光', '金以诺', '檀宇婷'];
const STATUSES = ['completed', 'completed', 'completed', 'completed', 'completed', 'failed', 'running', 'pending'];
const NODE_NAMES = ['油田-边缘节点#1', '油田-边缘节点#2', '油田-边缘节点#3', '油田-边缘节点#4'];
let tasks = [];
for (let i = 0; i < 35; i++) {
  const si = Math.floor(Math.random() * STATUSES.length);
  const ti = Math.floor(Math.random() * TYPES.length);
  tasks.push({
    id: `TASK_${1000 + i}`,
    name: TYPES[ti].name,
    icon: TYPES[ti].icon,
    status: STATUSES[si],
    node: STATUSES[si] === 'completed' || STATUSES[si] === 'running' ? NODE_NAMES[Math.floor(Math.random() * NODE_NAMES.length)] : '-',
    progress: STATUSES[si] === 'completed' ? 100 : STATUSES[si] === 'running' ? Math.floor(Math.random() * 75 + 15) : 0,
    time: Date.now() - (35 - i) * 3600000 * 0.8,
    duration: STATUSES[si] === 'completed' ? Math.floor(Math.random() * 300 + 30) : 0,
    submitter: SUBMITTERS[Math.floor(Math.random() * SUBMITTERS.length)],
  });
}
for (let i = 0; i < 3; i++) {
  tasks.push({
    id: `TASK_RUN_${i + 1}`,
    name: TYPES[i].name,
    icon: TYPES[i].icon,
    status: 'running',
    node: NODE_NAMES[i],
    progress: Math.floor(Math.random() * 70 + 20),
    time: Date.now() - Math.floor(Math.random() * 600000),
    duration: 0,
    submitter: SUBMITTERS[Math.floor(Math.random() * SUBMITTERS.length)],
  });
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  return NextResponse.json({ success: true, timestamp: new Date().toISOString(), total: tasks.length, tasks: filtered.slice(0, 50) });
}
export async function POST(request) {
  const body = await request.json();
  const { name } = body;
  const type = TYPES[0];
  const newTask = { id: `TASK_${3000 + Math.floor(Math.random() * 9000)}`, name: name || type.name, icon: type.icon, status: 'pending', node: '-', progress: 0, time: Date.now(), duration: 0, submitter: '张世沛' };
  tasks.unshift(newTask);
  return NextResponse.json({ success: true, task: newTask });
}
