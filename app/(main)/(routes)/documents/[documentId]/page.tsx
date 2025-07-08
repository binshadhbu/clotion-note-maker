"use client";
import Cover from '@/components/Cover';
import Toolbar from '@/components/Toolbar';
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

const Page =  ({ params}: documentIdPageProps) => {
  // const params =  useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return (<div>Loading...</div>);
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className='pb-40'>
      <Cover url={document.coverImage} />
      <div className='md:max-w-3xl lg:max-w-4xl'><Toolbar initialData={document} /></div>
    </div>
  )
}

export default Page
