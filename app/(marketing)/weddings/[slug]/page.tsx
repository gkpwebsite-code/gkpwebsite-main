type WeddingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params;

  return (
    <section className="editorial-container min-h-[60vh] px-5 py-32 md:px-10">
      <p className="text-label text-[var(--gk-beige-muted)]">Wedding story</p>
      <h1 className="font-display mt-4 text-4xl text-[var(--gk-ink)] md:text-6xl">
        {slug}
      </h1>
    </section>
  );
}
