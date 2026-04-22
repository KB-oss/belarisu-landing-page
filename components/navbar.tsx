// components/public/NavBar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const NavBar = () => {
    const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/donate', label: 'Donate' },
        { href: '/blog', label: 'Stories' },
        { href: '/booking', label: 'Contact' },
    ]

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="bg-background container mx-auto mt-5 rounded-full bg-white shadow-sm border">
            <div className="px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-1">
                    <Link href="/" className="font-bold text-xl">
                        <Image
                            src={'/landing/logo.png'}
                            width={'50'}
                            height={'50'}
                            alt='BMC Logo'
                        />
                    </Link>
                </div>

                {/* Desktop Navigation - Centered */}
                <nav className={cn("hidden md:flex flex-1 justify-center")}>
                    <ul className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "inline-flex h-9 w-max items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative",
                                            active
                                                ? "text-primary-orange after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary-orange after:rounded-full"
                                                : "text-muted-foreground hover:text-primary-orange"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Buttons - Right aligned */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-3">
                    <Link href={'/booking'}>
                        <Button className="bg-primary rounded-full text-xs cursor-pointer">
                            Book Appointment
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar