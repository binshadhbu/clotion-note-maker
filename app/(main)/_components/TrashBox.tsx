"use client";
import { ConfirmModal } from '@/components/modals/confirm-modal';
import Spinner from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((doc) => doc.title.toLowerCase().includes(search.toLowerCase()));

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, documentId: Id<"documents">) => {
        event.stopPropagation();
        try {
            const promise = restore({ id: documentId });
            toast.promise(promise, {
                loading: "Restoring document...",
                success: "Document restored successfully",
                error: "Failed to restore document",
            });
            await promise;

        } catch (error) {
            console.error("Failed to restore document:", error);
        }
    }

    const onRemove = async (documentId: Id<"documents">) => {
        try {
            const promise = remove({ id: documentId });
            toast.promise(promise, {
                loading: "Removing document...",
                success: "Document removed successfully",
                error: "Failed to remove document",
            });
            await promise;

            if (params.documentId === documentId) {
                router.push("/documents");
            }

        } catch (error) {
            console.error("Failed to remove document:", error);
        }
    }


    if (documents === undefined) {
        return (
            <div className='h-full flex items-center justify-center p-4'>
                <Spinner size={"lg"} />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="w-4 h-4" />
                <Input className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Filter by page title..." />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found
                </p>
                {filteredDocuments?.map(document => (
                    <div className="text-sm rounded-sm w-full hover:bg-primary/5 flex justify-between items-center text-primary"
                        key={document._id} role="button" onClick={() => onClick(document._id)}
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <button className="rounded-sm p-2 hover:bg-neutral-20 dark:hover:bg-neutral-600" onClick={e => onRestore(e, document._id)}>
                                <Undo className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div className="rounded-sm p-2 hover:bg-neutral-200
                dark:hover:bg-neutral-600" role="button">
                                    <Trash className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrashBox
