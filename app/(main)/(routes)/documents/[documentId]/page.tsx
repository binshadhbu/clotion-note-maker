"use client";
import Cover from '@/components/Cover';
import Editor from '@/components/Editor';
import Toolbar from '@/components/Toolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { use } from 'react'

interface documentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

const Page = ({ params }: documentIdPageProps) => {
  // const params =  useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return (<div>
      <Cover.Skeleton />
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
        <div className='space-y-4  pl-8 pt-4'>
          <Skeleton className='h-14 w-[50%]' />
          <Skeleton className='h-4 w-[80%]' />
          <Skeleton className='h-4 w-[40%]' />
          <Skeleton className='h-4 w-[60%]' />
        </div>
      </div>
    </div>);
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className='pb-40'>
      <Cover url={document.coverImage} />
      <div className='md:max-w-3xl lg:max-w-4xl'>
        <Toolbar initialData={document} />
        <Editor onChange={() => { }}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}

export default Page
