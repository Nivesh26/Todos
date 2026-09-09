import { useState, useRef, useEffect } from "react";
import { FaGithub, FaXTwitter, FaDribbble, FaEnvelope } from "react-icons/fa6";

export const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowAbout(false);
      }
    };
    if (showAbout) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAbout]);

  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-3 select-none">
      {/* GitHub Button */}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        title="View on GitHub"
        className="p-2 text-[#33322E] hover:opacity-75 transition-opacity"
      >
        <FaGithub className="w-5 h-5" />
      </a>

      {/* About Button & Popup */}
      <div className="relative" ref={popupRef}>
        <button
          type="button"
          onClick={() => setShowAbout(!showAbout)}
          className={`text-sm tracking-wide transition-all cursor-pointer ${
            showAbout ? "font-bold underline" : "font-semibold hover:font-bold"
          }`}
        >
          About
        </button>

        {showAbout && (
          <div className="popIn absolute top-8 right-0 w-[240px] p-5 bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] z-50 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#f8d966] border-2 border-[#33322E] flex items-center justify-center font-black text-lg">
                📝
              </div>
              <div>
                <div className="font-extrabold text-[#33322E] text-base">Todo Minimal</div>
                <div className="text-xs text-stone-500">Offline & Fast</div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-stone-600 mb-4 font-normal">
              A minimalist, no-login web todo app that keeps your tasks organized directly in your browser.
            </p>

            <div className="flex items-center gap-3 text-stone-700 mb-3 border-t border-stone-200 pt-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                title="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                title="Twitter / X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                title="Dribbble"
              >
                <FaDribbble className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@example.com"
                className="hover:text-black transition-colors"
                title="Email"
              >
                <FaEnvelope className="w-4 h-4" />
              </a>
            </div>

            <div className="text-[11px] text-stone-500 font-medium">
              🔒 Stored securely in your local browser
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
