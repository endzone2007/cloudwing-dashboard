import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const LOGS = [
  { ts: '14:32:01', msg: '节点 NODE_001 心跳正常，在线时间 12h', type: 'success' },
  { ts: '14:31:45', msg: '任务 TASK_3034 调度完成，分配至 NODE_001（评分96）', type: 'info' },
  { ts: '14:31:42', msg: '任务 TASK_3033 执行完成，结果已回传，checksum校验通过', type: 'success' },
  { ts: '14:31:30', msg: '评分引擎响应耗时 8ms，计算最优匹配', type: 'info' },
  { ts: '14:31:20', msg: '检测到 NODE_003 CPU使用率偏高（81%），已触发负载均衡', type: 'warning' },
  { ts: '14:31:15', msg: '新任务 TASK_3035 提交成功，等待调度队列', type: 'info' },
  { ts: '14:30:58', msg: '系统自检：调度内核、评分引擎、结果收集器 运行正常', type: 'success' },
  { ts: '14:30:45', msg: '节点 NODE_004 心跳正常，负载正常', type: 'success' },
  { ts: '14:30:30', msg: '断点续传：TASK_3031 恢复上传，进度 78%', type: 'info' },
  { ts: '14:30:15', msg: 'API网关处理请求 156 次，平均延迟 4.2ms', type: 'info' },
];
export async function GET() {
  return NextResponse.json({ success: true, timestamp: new Date().toISOString(), logs: LOGS });
}
