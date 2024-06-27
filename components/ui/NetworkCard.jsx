import React from 'react'
import Link from 'next/link'
import { spaceAfterCapital } from '@/lib/utils'

function NetworkCard({ name }) {
    return (
        <Link href={`/${name}`} className='my-5  '>
            <div className='bg-blue hover:bg-[#0051ffe0] active:bg-[#0051ffbd] w-72 p-6 rounded-lg text-white font-bold text-xl tracking-wider border-4 border-white'>
                {
                    spaceAfterCapital(name)
                }
            </div>
        </Link>
    )
}

export default NetworkCard