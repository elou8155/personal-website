"use client";
import Link from "next/link";
import {useState, type MouseEvent} from "react";

type Tab = {
    id: string;
    label: string;
};

type NavProps = {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
};

export default function Nav({tabs, activeTab, onTabChange}: NavProps) {
    const [open, setOpen] = useState(false);

    const selectTab = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        event.preventDefault();
        onTabChange(id);
        setOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-page/90 backdrop-blur-sm">
            <nav className="mx-auto max-w-7xl flex flex-wrap items-center justify-between p-4">
                <Link href="/" className="font-semibold" onClick={(event) => selectTab(event, "about")}> Emily Lou</Link>

                <button
                    className="sm:hidden"
                    aria-expanded={open}
                    aria-controls="nav-links"
                    aria-label="Toggle menu"
                    onClick={() => setOpen((s) => !s)}
                >
                    Menu
                </button>

                <ul
                    id="nav-links"
                    className={`${open ? "flex" : "hidden"} w-full flex-col gap-4 pt-4 sm:flex sm:w-auto sm:flex-row sm:gap-6 sm:pt-0`}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <li key={tab.id}>
                                <a
                                    href={`#${tab.id}`}
                                    aria-current={isActive ? "page" : undefined}
                                    className={isActive ? "underline decoration-rose decoration-2 underline-offset-8" : ""}
                                    onClick={(event) => selectTab(event, tab.id)}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    )
}
