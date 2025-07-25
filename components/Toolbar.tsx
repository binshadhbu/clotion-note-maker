"use client";
import { Doc, Id } from '@/convex/_generated/dataModel';
import React, { ElementRef, useRef } from 'react'
import { IconPicker } from './icon-picker';
import { Button } from './ui/button';
import { ImageIcon, Smile, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import TextareaAutosize from 'react-textarea-autosize';
import { api } from '@/convex/_generated/api';
import { useCoverImage } from '@/hooks/use-cover-image';

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(initialData.title || '');
    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);
    const coverImage = useCoverImage();

    const enableInout = () => {
        if (preview) return;
        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled",
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            disableInput();
        }
    }

    const onIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon: icon,
            title: initialData.title
        });
    };

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id
        });
    };

    return (
        <div className='pl-[54px] group relative'>
            {!!initialData.icon && !preview && (
                <div className="flex gap-x-2 items-center group/icon pt-6">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
                    </IconPicker>
                    <Button className="rounded-full opacity-0 group-hover/icon:opacity-100 transition
          text-muted-foreground text-xs" variant='outline' size='icon' onClick={onRemoveIcon}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker asChild onChange={onIconSelect}>
                        <Button className="text-muted-foreground text-xs" variant='outline' size='sm'>
                            <Smile className="w-4 h-4 mr-2" />
                            Add icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button className='text-muted-foreground text-xs' variant='outline' size='sm' onClick={coverImage.onOpen}>
                        <ImageIcon className='h-4 w-4 mr-2' />
                        Add cover image
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextareaAutosize ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className='text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#CFCFCF] resize-none'
                />) : (
                <div onClick={enableInout} className='pb-[11.5px] text-5xl font-bold outline-none cursor-pointer text-[#3f3f3f] dark:text-[#CFCFCF]'>
                    {initialData.title}
                </div>
            )}
        </div>
    )
}

export default Toolbar
