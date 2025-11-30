function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-6 text-xs text-slate-500 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} Interview Agent. All rights reserved.</span>
        <span>Built with GPT-5-Codex (Preview) assisted workflows.</span>
      </div>
    </footer>
  );
}

export default Footer;
