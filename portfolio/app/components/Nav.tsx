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
                    <li><Link href="#experiences"> Experience</Link></li>
                    <li><Link href="#projects">Projects</Link></li>
                    <li><Link href="#Skills">Skills</Link> </li>
                    <li><Link href="#Contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
   
    )
}