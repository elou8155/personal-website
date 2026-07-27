"use client";
import Link from "next/link";
import {useState} from "react";

export default function Nav() {
    const [open, setOpen] = useState(false);
    return (
        <header className="sticky top-0 bg-cream/90 backdrop-blur-sm">
            <nav className="mx-auto max-w-7xl flex items-center justify-between p-4">
                <Link href="/" className="font-semibold"> Emily Lou</Link>
                
                <button
                    className="sm:hidden"
                    aria-expanded={open}
                    aria-label="Toggle menu"
                    onClick={() => setOpen((s) => !s)}
                >
                    Menu
                </button>

                <ul className={`hidden sm:flex gap-6 ${open ? "block" : ""}`}>
                    <li><Link href="#about">About Me</Link></li>
                    <li><Link href="#experience"> Experience</Link></li>
                    <li><Link href="#projects">Projects</Link></li>
                    <li><Link href="#skills">Skills</Link> </li>
                    <li><Link href="#contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
   
    )
}