"use client";

import {useEffect, useState} from "react";

export default function Terminal() {
    const command = "run emily_lou_profile.exe";
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => {
        setOpen(true);

        let i = 0;
        const timer = window.setInterval(() => {
            i += 1;
            setText(command.slice(0, i));

            if (i >= command.length) {
                window.clearInterval(timer);
            }
        }, 80)

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div
            className={`fixed bottom-0 z-50 inset-x-0 w-full transition-transform duration-1500 ease-out ${
                open ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <div className="rounded-t-3xl border border-b-0 border-black/10 bg-grey px-5 pt-3 pb-50 shadow-2xl">
                <div className="mb-3 flex items-center gap-2">
                    <div className="ml-3 flex gap-8 text-md tracking-[0.25] text-white/60">
                        <span>PROBLEMS</span>
                        <span>OUTPUT</span>
                        <span className="border-b-2 border-pink-400">
                            TERMINAL
                            </span>
                        <span>DEBUG CONSOLE</span>
                </div>
                <div>
                    <p>
                        {command}
                    </p>
                </div>
                    
                </div>

            </div>
        </div>
    )
}
