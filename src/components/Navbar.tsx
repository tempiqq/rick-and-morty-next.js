import React from 'react'
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className='bg-slate-200 text-slate-800 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>Rick & Morty <span className="text-blue-400">Wiki</span></Link>
        <div className='space-x-4'>
          <Link href='/' className='hover:text-gray-500'>Characters</Link>
          {/* <Link href='/episodes' className='hover:text-gray-500'>Episodes</Link> */}
          {/* <Link href='/locations' className='hover:text-gray-500'>Locations</Link> */}
        </div>
      </div>
    </nav>
  )
}
