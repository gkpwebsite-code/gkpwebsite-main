/** Simple holding page for sections whose content is still being written. */
export default function PlaceholderView({
  title,
  note = "Coming soon",
}: {
  title: string;
  note?: string;
}) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-8 text-center">
      <h1 className="font-display text-5xl md:text-8xl">{title}</h1>
      <p className="mt-8 font-logo-sub text-[0.6875rem] tracking-[0.15em] text-muted uppercase md:text-xs">
        {note}
      </p>
    </section>
  );
}
