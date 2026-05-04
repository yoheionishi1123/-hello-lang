import './globals.css'
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Hello Lang',
  description: 'Translate daily phrases instantly and learn them effectively.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <div className="main-container">
          <div className="content-area">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
