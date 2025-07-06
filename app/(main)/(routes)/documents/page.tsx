"use client";
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const Page = () => {
  const { user } = useUser();
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src={'/empty.png'} alt='No documents' width={300} height={300} className='dark:hidden' />
      <Image src={'/empty-dark.png'} alt='No documents' width={300} height={300} className='dark:block hidden' />
      <h2 className='text-lg font-medium'>Welcome to {user?.firstName}&apos;s workspace</h2>
      <Button>
        <PlusCircle className='h-4 w-4 mr-2' />
        New Document
      </Button>
    </div>
  )
}

export default Page
