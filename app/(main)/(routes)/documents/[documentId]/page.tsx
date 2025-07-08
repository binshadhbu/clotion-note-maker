"use client";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React from 'react'

interface documentIdPageProps {
  params:{
    documentId:Id<"documents">;
  };
};

const page = ({ params }: documentIdPageProps) => {
  const document=useQuery(api.documents.getById,{
    documentId:params.documentId
  });

  return (
    <div>
      {params.documentId}
    </div>
  )
}

export default page
