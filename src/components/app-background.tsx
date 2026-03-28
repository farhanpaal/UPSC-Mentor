export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-indigo-500/20 blur-[120px] dark:bg-indigo-500/15" />
      <div className="absolute -right-1/4 top-1/3 h-[380px] w-[60%] rounded-full bg-violet-500/15 blur-[100px] dark:bg-violet-500/10" />
      <div className="absolute bottom-0 left-1/3 h-[280px] w-[45%] rounded-full bg-amber-400/10 blur-[90px]" />
    </div>
  );
}
