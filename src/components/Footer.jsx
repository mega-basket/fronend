import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-slate-200/60 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            © <span>{year}</span> ShopAll. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-4">
            <a
              href="/about"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              About
            </a>
            <a
              href="/support"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Support
            </a>
            <a
              href="/terms"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
