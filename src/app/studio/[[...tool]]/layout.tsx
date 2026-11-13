/** Full-screen Studio — no site nav, footer, or intro. */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh max-h-dvh w-screen overflow-hidden overscroll-none bg-white">
      {children}
    </div>
  );
}
