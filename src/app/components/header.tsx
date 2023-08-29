'use client'

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const currentPathname = ('home' + usePathname()).replace(/\//, ' \/ ');
  const paths = currentPathname.split('/');

  return (
    <div className='p-2 m-auto flex justify-between'>
      <div><Link href='/'>crikey.ooo</Link></div>
      <div>{currentPathname}</div>
      <div>Connected</div>
    </div>
  );
}
