export default function HomePage() {
  return (
    <section className="relative flex min-h-screen items-end px-5 pt-28 pb-16 md:px-10 md:pb-20">
      <div className="editorial-container w-full">
        <p className="text-label text-[var(--gk-beige-muted)]">Foundation</p>
        <h1 className="font-display mt-6 max-w-4xl text-5xl text-[var(--gk-ink)] md:text-7xl lg:text-8xl">
          Gautam Khullar
        </h1>
        <p className="font-display mt-4 text-2xl text-[var(--gk-ink-soft)] md:text-4xl">
          Wedding Photography
        </p>
        <p className="font-body mt-8 max-w-md text-sm text-[var(--gk-ink-soft)] md:text-base">
          Visual foundation in progress. The cinematic homepage comes next.
        </p>
      </div>
    </section>
  );
}
