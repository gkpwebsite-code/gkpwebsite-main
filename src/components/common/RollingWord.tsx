/** Letters roll up and back in a ripple when the nearest `group` ancestor is hovered or focused. */
export default function RollingWord({ text }: { text: string }) {
  return (
    <span className="whitespace-nowrap" aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span
          key={index}
          className="inline-block group-hover:animate-[intro-letter-roll_900ms_both] group-focus-visible:animate-[intro-letter-roll_900ms_both]"
          style={{ animationDelay: `${index * 25}ms` }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}
