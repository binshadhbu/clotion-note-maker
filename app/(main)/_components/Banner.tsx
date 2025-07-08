"use client";
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

interface BannerProps {
    documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = async () => {
        const promise = remove({ id: documentId });
        toast.promise(promise, {
            loading: 'Removing document...',
            success: 'Document removed successfully!',
            error: 'Error removing document.',
        });

        router.push('/documents'); // Redirect to home after deletion
        redirect('/documents'); // Ensure the redirect happens

    }

    const onRestore = () => {
        const promise = restore({ id: documentId });
        toast.promise(promise, {
            loading: 'Restoring document...',
            success: 'Document restored successfully!',
            error: 'Error restoring document.',
        });
    }

    return (
        <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
            <p>This Page is Archived</p>
            <Button size={'sm'} variant={'outline'} className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal' onClick={onRestore} >
                Restore Page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button size={'sm'} variant={'outline'} className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'  >
                    Delete forever
                </Button>
            </ConfirmModal>

        </div>
    )
}

export default Banner
