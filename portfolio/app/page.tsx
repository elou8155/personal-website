"use client";

import {useSyncExternalStore} from "react";
import Nav from "./components/Nav";
import Terminal from "./components/Terminal";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";

// Set to true to show the animated terminal again.
const SHOW_TERMINAL = false;

const tabs = [
  {id: "about", label: "About Me"},
  {id: "experience", label: "Experience"},
  {id: "projects", label: "Projects"},
];

const sections: Record<string, React.ReactNode> = {
  about: <About />,
  experience: <Experience />,
  projects: <Projects />,
};

// The homepage: shown at "/" and whenever the address doesn't name a tab
const DEFAULT_TAB = "about";

// The open tab lives in the URL hash (e.g. /#projects), so links,
// refresh, and the back/forward buttons all work.
const TAB_CHANGE_EVENT = "tabchange";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(TAB_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(TAB_CHANGE_EVENT, onChange);
  };
}

function getActiveTab() {
  const hash = window.location.hash.slice(1);
  return tabs.some((tab) => tab.id === hash) ? hash : DEFAULT_TAB;
}

function getServerActiveTab() {
  return DEFAULT_TAB;
}

export default function Home(){
  const activeTab = useSyncExternalStore(subscribe, getActiveTab, getServerActiveTab);

  const changeTab = (id: string) => {
    if (id === activeTab) return;
    // The homepage gets the clean address "/", the other tabs get "/#tab"
    const url = id === DEFAULT_TAB ? window.location.pathname : `#${id}`;
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(TAB_CHANGE_EVENT));
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Nav tabs={tabs} activeTab={activeTab} onTabChange={changeTab} />
      <main>
        {sections[activeTab]}
        {SHOW_TERMINAL && <Terminal />}
      </main>
    </>
  )
}
