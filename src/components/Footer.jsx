import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-slate-200/60 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600 dark:text-black">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            © <span>{year}</span> ShopAll. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-4">
            <a href="/about" className="">
              About
            </a>
            <a href="/support" className="">
              Support
            </a>
            <a href="/terms" className="">
              Terms
            </a>
            <a href="/privacy" className="">
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
