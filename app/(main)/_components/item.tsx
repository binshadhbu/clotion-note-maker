"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { ChevronDown, ChevronRight, Divide, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import React from 'react'
import { toast, Toaster } from 'sonner';
import { useUser } from "@clerk/clerk-react"

interface ItemProps {
    id?: Id<'documents'>;
    documenticon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    onClick?: () => void;
    label: string;
    icon: React.ElementType;
}

const Item = ({ id, documenticon, active, expanded: exapanded, isSearch, level = 0, onExpand, onClick, label, icon: Icon }: ItemProps) => {
    const create = useMutation(api.documents.create);
    const router = useRouter();
    const user = useUser();
    const archive = useMutation(api.documents.archive);

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;
        const promise = archive({ id });

        toast.promise(promise, {
            loading: 'Archiving note...',
            success: 'Note archived!',
            error: 'Failed to archive note'
        })
    };

    const handleExpand = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (onExpand) {
            onExpand?.();
        }

    }

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (!id) return
        const promise = create({ title: "Untitled", parentDocument: id })
            .then((documentId) => {
                if (!exapanded) {
                    onExpand?.()
                }
                // router.push(`/documents/${documentId}`)
            })

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note'
        })
    }

    const ChevronIcon = exapanded ? ChevronDown : ChevronRight;

    return (
        <div onClick={onClick} style={{ paddingLeft: level ? `${(level * 12 + 12)}px` : "12px" }} role='button' className={cn('group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium', active && "bg-primary/5 text-primary ")}>
            {!!id && (
                <div className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1' role='button' onClick={handleExpand}>
                    <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
                </div>
            )}
            {documenticon ? (
                <div className='shrink-0 mr-2 text-[18px]'>{documenticon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}

            <span className='truncate'>{label}</span>
            {isSearch && (
                <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 roudned border bg-muted  px-1.5 font-mono text-[10px] font-medium text-muted-foreground '>
                    <span className='text-xs'>
                        ctrl+
                    </span>k
                </kbd>
            )}

            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
              hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                                Last edited by: {user?.user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        role="button" onClick={onCreate}>
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div style={{ paddingLeft: level ? `${(level * 12 + 25)}px` : "12px" }} className='flex gap-x-2 py-[3px]' >
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-[30%]' />
        </div>
    )
}

export default Item

