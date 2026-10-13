'use client'
import { useState, useEffect } from 'react'
const STATUS_COLOR = { pending: '#3fb950', running: '#388bfd', completed: '#3fb950', failed: '#f85149' }
const STATUS_NAMES = { pending: '等待中', running: '执行中', completed: '已完成', failed: '失败' }
const LOG_COLOR = { success: '#3fb950', info: '#388bfd', warning: '#d29922', error: '#f85149' }
const TYPES = [
  { name: '油田地震数据异常区域推理', icon: '🛢' },
  { name: '矿山点云分割（PointNet）', icon: '⛏' },
  { name: '地质建模数据处理', icon: '🔬' },
  { name: '图像分类（Mobilenet）', icon: '📷' },
  { name: '目标检测（YOLOv8）', icon: '🎯' },
  { name: '传感器数据融合分析', icon: '⚡' },
]
const SUBMITTERS = ['张世沛', '陈麒光', '金以诺', '檀宇婷']
function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
      <div style={{ fontSize: 11, color: '#656d76', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#656d76', marginTop: 4 }}>{sub}</div>
    </div>
  )
}
function NodeCard({ n }) {
  const getColor = (v) => v > 80 ? '#f85149' : v > 50 ? '#d29922' : '#3fb950'
  const sc = n.status === 'online' ? '#3fb950' : n.status === 'busy' ? '#d29922' : '#f85149'
  const sl = n.status === 'online' ? '在线' : n.status === 'busy' ? '忙碌' : '离线'
  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, padding: '10px 12px', marginBottom: 8, opacity: n.status === 'offline' ? 0.5 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3' }}>{n.name}</span>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: sc + '20', color: sc, fontWeight: 500 }}>{sl}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>算力</span><span style={{ fontSize: 12, fontWeight: 600, color: '#c5c8cd' }}>{n.cfu} CFU</span></div>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>评分</span><span style={{ fontSize: 12, fontWeight: 600, color: n.score > 80 ? '#3fb950' : '#d29922' }}>{n.score}</span></div>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>延迟</span><span style={{ fontSize: 12, fontWeight: 600, color: '#c5c8cd' }}>{n.net}ms</span></div>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>CPU</span><span style={{ fontSize: 12, fontWeight: 600, color: getColor(n.cpu) }}>{n.cpu}%</span></div>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>内存</span><span style={{ fontSize: 12, fontWeight: 600, color: getColor(n.mem) }}>{n.mem}%</span></div>
        <div><span style={{ fontSize: 10, color: '#3d444d' }}>硬件</span><span style={{ fontSize: 10, fontWeight: 600, color: '#c5c8cd' }}>{n.hw}</span></div>
      </div>
      {n.status !== 'offline' && (
        <div style={{ height: 3, background: '#21262d', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: n.cpu + '%', background: getColor(n.cpu), borderRadius: 2, transition: 'width 1s ease' }} />
        </div>
      )}
    </div>
  )
}
function TaskRow({ t }) {
  const ago = Math.floor((Date.now() - t.time) / 60000)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #1c2128' }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{t.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#c5c8cd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
        <div style={{ fontSize: 10, color: '#3d444d', marginTop: 2, display: 'flex', gap: 8 }}>
          <span>{t.id}</span><span>{ago}分钟前</span>
          {t.node !== '-' && <span>→ {t.node}</span>}
        </div>
      </div>
      {t.status === 'running' && <span style={{ fontSize: 10, color: '#656d76', flexShrink: 0 }}>{t.progress}%</span>}
      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500, background: STATUS_COLOR[t.status] + '20', color: STATUS_COLOR[t.status], flexShrink: 0 }}>{STATUS_NAMES[t.status]}</span>
    </div>
  )
}
function LogRow({ l }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid #1c2128', fontSize: 11 }}>
      <span style={{ color: '#3d444d', flexShrink: 0, width: 55, fontFamily: 'monospace', fontSize: 10 }}>{l.ts}</span>
      <span style={{ color: LOG_COLOR[l.type] || '#8b949e', flex: 1 }}>{l.msg}</span>
    </div>
  )
}
export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [nodes, setNodes] = useState([])
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])
  const [stat, setStat] = useState({ nodes: { online: 4, total: 5 }, cfu: { total: 258 }, tasks: { today: 93, successRate: 97.8 }, latency: 18 })
  const [taskFilter, setTaskFilter] = useState('all')
  const [logFilter, setLogFilter] = useState('all')
  const [formData, setFormData] = useState({ name: '', type: 'inference', priority: 50, est: 300, cfu: 30, mem: 4, tags: '', input: '' })
  const fetchAll = () => {
    fetch('/api/nodes').then(r => r.json()).then(d => { if (d.nodes) setNodes(d.nodes) }).catch(() => { })
    fetch('/api/tasks').then(r => r.json()).then(d => { if (d.tasks) setTasks(d.tasks) }).catch(() => { })
    fetch('/api/logs').then(r => r.json()).then(d => { if (d.logs) setLogs(d.logs) }).catch(() => { })
    fetch('/api/status').then(r => r.json()).then(d => { if (d.data) setStat(d.data) }).catch(() => { })
  }
  useEffect(() => {
    fetchAll()
    const iv = setInterval(fetchAll, 3000)
    return () => clearInterval(iv)
  }, [])
  const handleSubmit = async () => {
    if (!formData.name) return
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await res.json()
      if (data.task) {
        setTasks(prev => [data.task, ...prev])
        setFormData({ name: '', type: 'inference', priority: 50, est: 300, cfu: 30, mem: 4, tags: '', input: '' })
      }
    } catch (e) { }
  }
  const now = new Date()
  const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false })
  const dateStr = now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', weekday: 'short' })
  const fTasks = taskFilter === 'all' ? tasks : tasks.filter(t => t.status === taskFilter)
  const fLogs = logFilter === 'all' ? logs : logs.filter(l => l.type === logFilter)
  const TABS = [{ id: 'overview', l: '总览', i: '📊' }, { id: 'nodes', l: '节点', i: '🖥' }, { id: 'tasks', l: '任务', i: '📋' }, { id: 'submit', l: '提交', i: '➕' }, { id: 'logs', l: '日志', i: '📝' }]
  const onlineCount = Array.isArray(nodes) ? nodes.filter(n => n.status !== 'offline').length : 0
  return (
    <div style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif', background: '#0a0e14', color: '#c5c8cd', minHeight: '100vh' }}>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:0.4} } ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#0d1117} ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}`}</style>
      <header style={{ background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #1c2128', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #0d419d, #1a6fbb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>☁</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3' }}>云翼终端 · 分布式算力池化管理平台</div>
            <div style={{ fontSize: 10, color: '#656d76' }}>CloudWing — 野外工程场景异构算力调度系统</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 20, padding: '4px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6feb', animation: 'livePulse 1.8s ease-in-out infinite' }} />
            <span style={{ color: '#3fb950' }}>●</span>
            <span style={{ color: '#8b949e', fontSize: 11 }}>系统正常</span>
          </div>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 6, padding: '4px 10px', fontFamily: 'monospace', fontSize: 13, color: '#8b949e' }}>{timeStr}</div>
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#8b949e' }}>{dateStr}</div>
        </div>
      </header>
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 56 }}>
        <nav style={{ width: 210, background: '#0d1117', borderRight: '1px solid #1c2128', padding: '12px 0', position: 'fixed', top: 56, bottom: 0, overflowY: 'auto' }}>
          {TABS.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
              color: tab === t.id ? '#e6edf3' : '#656d76', cursor: 'pointer', transition: 'all 0.15s',
              borderLeft: '2px solid ' + (tab === t.id ? '#1a6fbb' : 'transparent'),
              background: tab === t.id ? '#161b22' : 'transparent', fontSize: 13
            }}>
              <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{t.i}</span>{t.l}
            </div>
          ))}
        </nav>
        <main style={{ flex: 1, marginLeft: 210, padding: '16px 20px' }}>
          {tab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
                <StatCard label="在线节点" value={onlineCount} color="#388bfd" sub={'共注册 ' + nodes.length + ' 台'} />
                <StatCard label="总算力" value={stat.cfu ? stat.cfu.total : 258} color="#3fb950" sub="CFU · RTX 3080基准" />
                <StatCard label="今日任务" value={stat.tasks ? stat.tasks.today : 0} color="#d29922" sub={'成功率 ' + (stat.tasks ? stat.tasks.successRate : 97.8) + '%'} />
                <StatCard label="P99延迟" value={(stat.latency || 18) + 'ms'} color="#f85149" sub="实时更新" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
                <div>
                  <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>🖥 节点状态</span>
                      <button onClick={fetchAll} style={{ float: 'right', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', fontSize: 11, cursor: 'pointer', padding: '2px 8px' }}>🔄</button>
                    </div>
                    <div style={{ padding: 12 }}>{nodes.slice(0, 4).map(n => <NodeCard key={n.id} n={n} />)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>📋 进行中任务</span></div>
                    <div style={{ padding: '0 14px', maxHeight: 260, overflowY: 'auto' }}>
                      {tasks.filter(t => t.status === 'running' || t.status === 'pending').slice(0, 6).map(t => <TaskRow key={t.id} t={t} />)}
                      {tasks.filter(t => t.status === 'running' || t.status === 'pending').length === 0 && (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: '#3d444d', fontSize: 12 }}>暂无进行中任务</div>
                      )}
                    </div>
                  </div>
                  <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>📝 实时日志</span><span style={{ float: 'right', fontSize: 10, color: '#3d444d' }}>自动刷新</span></div>
                    <div style={{ padding: '0 14px', maxHeight: 260, overflowY: 'auto' }}>
                      {logs.slice(0, 10).map((l, i) => <LogRow key={i} l={l} />)}
                      {logs.length === 0 && (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: '#3d444d', fontSize: 12 }}>暂无日志</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === 'nodes' && (
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>🖥 节点管理</span></div>
              <div style={{ padding: 12 }}>{nodes.map(n => <NodeCard key={n.id} n={n} />)}</div>
            </div>
          )}
          {tab === 'tasks' && (
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>📋 任务列表</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['all', 'pending', 'running', 'completed'].map(f => (
                    <button key={f} onClick={() => setTaskFilter(f)} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid ' + (taskFilter === f ? '#1a6fbb' : '#30363d'), background: taskFilter === f ? '#1a6fbb' : '#21262d', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                      {f === 'all' ? '全部' : f === 'pending' ? '等待' : f === 'running' ? '运行' : '完成'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 14px', maxHeight: 520, overflowY: 'auto' }}>
                {fTasks.map(t => <TaskRow key={t.id} t={t} />)}
                {fTasks.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#3d444d' }}>暂无任务</div>}
              </div>
            </div>
          )}
          {tab === 'submit' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>➕ 提交新任务</span></div>
                <div style={{ padding: 16 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#656d76', marginBottom: 5, display: 'block' }}>任务名称 *</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="例如：油田地震数据异常区域推理_v2" style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '7px 10px', color: '#c5c8cd', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#656d76', marginBottom: 5, display: 'block' }}>任务类型</label>
                      <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '7px 10px', color: '#c5c8cd', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                        <option value="inference">🤖 AI推理</option><option value="training">🧠 模型训练</option><option value="processing">📊 数据处理</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#656d76', marginBottom: 5, display: 'block' }}>优先级 (1-100)</label>
                      <input type="number" min="1" max="100" value={formData.priority} onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })} style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '7px 10px', color: '#c5c8cd', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#656d76', marginBottom: 5, display: 'block' }}>预估执行时间(秒)</label>
                      <input type="number" value={formData.est} onChange={e => setFormData({ ...formData, est: Number(e.target.value) })} style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '7px 10px', color: '#c5c8cd', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#656d76', marginBottom: 5, display: 'block' }}>最低算力 (CFU)</label>
                      <input type="number" value={formData.cfu} onChange={e => setFormData({ ...formData, cfu: Number(e.target.value) })} style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '7px 10px', color: '#c5c8cd', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <button onClick={handleSubmit} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #1a6fbb', background: '#1a6fbb', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>🚀 提交任务</button>
                </div>
              </div>
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #21262d' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>📝 任务模板</span></div>
                <div style={{ padding: '0 14px' }}>
                  {TYPES.map((t, i) => (
                    <div key={i} onClick={() => setFormData({ ...formData, name: t.name })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1c2128', cursor: 'pointer' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, color: '#c5c8cd' }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: '#3d444d', marginTop: 2 }}>AI推理 · 80MB输入</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'logs' && (
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>📝 运行日志</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={logFilter} onChange={e => setLogFilter(e.target.value)} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', fontSize: 11, outline: 'none', padding: '2px 8px' }}>
                    <option value="all">全部级别</option><option value="info">INFO</option><option value="success">SUCCESS</option><option value="warning">WARNING</option>
                  </select>
                  <button onClick={fetchAll} style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', fontSize: 11, cursor: 'pointer', padding: '2px 8px' }}>🔄 刷新</button>
                </div>
              </div>
              <div style={{ padding: 10, margin: 10, background: '#0d1117', borderRadius: 6, maxHeight: 520, overflowY: 'auto' }}>
                {fLogs.map((l, i) => <LogRow key={i} l={l} />)}
                {fLogs.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#3d444d' }}>暂无日志</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
