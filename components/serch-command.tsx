"use client";
import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/useSearch';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useScreen } from 'usehooks-ts';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { userAgent } from 'next/server';
import { File, Rotate3D } from 'lucide-react';

const SearchCommand = () => {

    const { user } = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);
    const [isMounted, setIsMounted] = React.useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(()=>{
        const down=(e:KeyboardEvent)=>{
            if(e.key === "k" && (e.metaKey || e.ctrlKey) ){
                e.preventDefault();
                toggle();
            }
        }
        document.addEventListener("keydown",down);
        return ()=>{
            document.removeEventListener("keydown",down);
        }
    },[toggle])

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    if (!isMounted) return null;





    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder={`search ${user?.fullName}'s motion...`} />
            <CommandList>
                <CommandEmpty>
                    No results found.
                </CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map((doc) => (
                        <CommandItem key={doc._id} value={`${doc._id}-${doc.title}`} title={doc.title} onSelect={onSelect}>
                            {doc.icon ? (
                                <p className='mr-2 text-[18px]'>{doc.icon}</p>
                            ) : (
                                <File className='mr-2 h-4 w-4' />
                            )}
                            <span>{doc.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>

        </CommandDialog>
    )
}

export default SearchCommand;
