import './globals.css'
export const metadata = { title: '云翼终端 - 分布式算力池化管理平台', description: 'CloudWing 野外工程场景异构算力调度系统' }
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
