'use client'

import Link from 'next/link';

const Home = () => {
  return (
    <main className="flex flex-col justify-between p-24">
      <div><Link href='/screener'>Screener</Link></div>
      <div><Link href='/wallets-for-review'>Wallets For Review</Link></div>
      <div><Link href='/watched-wallets'>Watched Wallets Screener</Link></div>
    </main>
  )
}

export default Home;