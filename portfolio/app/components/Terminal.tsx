"use client";

import {useEffect, useState} from "react";

function TerminalHeader() {
    return (
        <div className="rounded-t-3xl border border-b-0 border-black/10 bg-grey px-5 pt-3 pb-0.5 shadow-2xl">
            <div className="mb-3 flex items-center gap-2">
                <div className="ml-3 flex gap-8 text-md tracking-[0.25] text-white/60">
                    <span>PROBLEMS</span>
                    <span>OUTPUT</span>
                    <span className="border-b-2 border-pink-400">
                        TERMINAL
                        </span>
                    <span>DEBUG CONSOLE</span>
            </div>                 
            </div>

        </div>
    )
}

function TerminalBody() {
    const command = "run emily_lou_profile.exe";
    const [text, setText] = useState("");

    useEffect(() => {
        let i = 0;
        let timer;

        const delay = window.setTimeout(() => {

            const timer = window.setInterval(() => {
                i += 1;
                setText(command.slice(0, i));

                if (i >= command.length) {
                    window.clearInterval(timer);
                }
            }, 100)

        }, 1800);

        return () => {
            window.clearInterval(timer);
            window.clearTimeout(delay);
        };
    }, []);

    return (
        <div className="bg-grey px-5 py-2 pb-40 font-mono text-sm sm:text-base">
            <div className="text-white flex items-start gap-2">
                <span> visitor@emilys-website </span>
                <span> ~ %</span>
                <span>{text}</span>
                <span className="ml-1 animate-pulse [animation-duration:0.2s"> █</span>
            </div>
        </div>
    );
}

export default function Terminal() {
const [open, setOpen] = useState(false);

  useEffect(() => {
    const delay = window.setTimeout(() => {
    setOpen(true);
    }, 600);

    return () => window.clearTimeout(delay);
}, []);


  return(
    <div
    className={`fixed inset-x-0 bottom-0 z-50 w-full transition-transform duration-1500 ease-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
        <div className="rounded-t-lg shadow-2xl overflow-hidden">
            <TerminalHeader />
            <TerminalBody />
        </div>
    </div>
  )

}
