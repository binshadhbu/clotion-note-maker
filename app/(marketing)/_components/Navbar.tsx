"use client";
import { useScrollTop } from '@/hooks/useScrollTop';
import { cn } from '@/lib/utils';
import React from 'react'
import { Logo } from './Logo';
import { ModeToggle } from '@/components/mode-toggle';
import { useConvexAuth } from 'convex/react';
import { SignIn, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import Link from 'next/link';

const Navbar = () => {
    const scrolled = useScrollTop();
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className={cn("z-50 bg-background fixed top-0 flex items-center w-full p-6", scrolled && "border-b shadow-sm")}>
            <Logo />
            <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
                {isLoading && (
                    <Spinner />
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size={"sm"} >
                                Login
                            </Button>

                        </SignInButton>

                        <SignInButton mode="modal">
                            <Button size={"sm"} >
                                Get motion
                            </Button>

                        </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size={"sm"} asChild>
                            <Link href="/documents">Enter motion</Link>
                        </Button>
                        <UserButton afterSwitchSessionUrl='/' />
                    </>
                )
                }
                <ModeToggle />

            </div>
        </div>
    )
}

export default Navbar
