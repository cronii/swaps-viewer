'use client'

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const currentPathname = ('home' + usePathname()).replace(/\//g, ' \/ ');
  
  // const currentPathname = ('home' + usePathname()).toLowerCase();
  // const paths = currentPathname.split('/');

  // const test = <Link href='/'>home</Link>
  // const test2 = <Link href='/screener'>screener</Link>

  return (
    <div className='p-4 m-auto flex justify-between'>
      <div><Link href='/'>crikey.ooo</Link></div>
      <div>{currentPathname}</div>
      <div>Placeholder</div>
    </div>
  );
}
