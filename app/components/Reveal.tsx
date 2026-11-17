"use client";

import {useEffect, useRef, useState, type ReactNode} from "react";

// A list item that fades in and slides up the first time it scrolls into view.
// (With reduced motion turned on, the CSS shows it right away.)
export default function RevealItem({children, className = ""}: {children: ReactNode; className?: string}) {
    const ref = useRef<HTMLLIElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const item = ref.current;
        if (!item) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {threshold: 0.15, rootMargin: "0px 0px -8% 0px"}
        );
        observer.observe(item);
        return () => observer.disconnect();
    }, []);

    return (
        <li ref={ref} className={`reveal${visible ? " is-visible" : ""} ${className}`}>
            {children}
        </li>
    );
}
