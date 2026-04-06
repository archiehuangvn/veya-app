import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import ClientShell from '@/components/ClientShell'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Veya – LắngNgheNhau',
  description: 'Ứng dụng hẹn hò qua giọng nói cho người Việt tại Đài Loan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <div className="phone-frame">
          <ClientShell>{children}</ClientShell>
        </div>
      </body>
    </html>
  )
}
