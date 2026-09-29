import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import { SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  cammron,
  formaBannerMedium,
  schneidler,
  silkSerifLight,
  silkSerifLightItalic,
} from "./fonts";

function Mark({
  fontClassName,
  nameClassName,
  subClassName,
}: {
  fontClassName: string;
  nameClassName?: string;
  subClassName?: string;
}) {
  return (
    <div className="inline-flex w-max flex-col items-center">
      <span
        className={cn(
          fontClassName,
          "text-3xl leading-none tracking-[0.06em] whitespace-nowrap uppercase md:text-4xl",
          nameClassName,
        )}
      >
        {SITE_SHORT_NAME}
      </span>
      <span
        className={cn(
          "mt-1 -mr-[0.15em] font-logo-sub text-[0.625rem] leading-none tracking-[0.15em] uppercase md:text-[0.6875rem]",
          subClassName,
        )}
      >
        Photography
      </span>
    </div>
  );
}

type Variation = {
  label: string;
  nameClassName?: string;
  subClassName?: string;
};

const standardVariations: Variation[] = [
  { label: "Caps" },
  {
    label: "Caps, wide",
    nameClassName: "tracking-[0.16em]",
    subClassName: "mt-1.5 tracking-[0.4em] -mr-[0.4em]",
  },
  { label: "Mixed case", nameClassName: "normal-case tracking-[0.02em]" },
];

const fontGroups: {
  name: string;
  fontClassName: string;
  variations: Variation[];
}[] = [
  {
    name: "Cammron",
    fontClassName: cammron.className,
    variations: standardVariations,
  },
  {
    name: "Forma DJR Banner Medium",
    fontClassName: formaBannerMedium.className,
    variations: standardVariations,
  },
  {
    name: "Schneidler Initials",
    fontClassName: schneidler.className,
    variations: [
      ...standardVariations,
      {
        label: "Subtitle in Sweet Sans Thin",
        subClassName: "font-body font-thin tracking-[0.3em] -mr-[0.3em]",
      },
    ],
  },
  {
    name: "Silk Serif Light",
    fontClassName: silkSerifLight.className,
    variations: standardVariations,
  },
  {
    name: "Silk Serif Light Italic",
    fontClassName: silkSerifLightItalic.className,
    variations: standardVariations,
  },
];

function Tile({
  label,
  dark,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col",
        dark ? "bg-night text-paper" : "bg-mist text-ink",
      )}
    >
      <div className="flex min-h-52 items-center justify-center p-10">
        {children}
      </div>
      <figcaption
        className={cn(
          "px-6 pb-5 text-[0.6875rem] tracking-wide uppercase",
          dark ? "text-paper/50" : "text-muted",
        )}
      >
        {label}
      </figcaption>
    </figure>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-16 text-[0.6875rem] tracking-wide text-muted uppercase">
      {children}
    </h2>
  );
}

export default function LogoView() {
  return (
    <section className="bg-canvas pt-40 pb-24 text-ink">
      <Container>
        <p className="text-[0.6875rem] tracking-eyebrow text-muted uppercase">
          Logo variations
        </p>

        <SectionHeading>Locked</SectionHeading>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Tile label="Forma Micro Bold + Forma Banner Regular">
            <Logo />
          </Tile>
          <Tile label="On dark" dark>
            <Logo />
          </Tile>
        </div>

        {fontGroups.map((group) => (
          <div key={group.name}>
            <SectionHeading>{group.name}</SectionHeading>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {group.variations.map((variation) => {
                const mark = (
                  <Mark
                    fontClassName={group.fontClassName}
                    nameClassName={variation.nameClassName}
                    subClassName={variation.subClassName}
                  />
                );
                return [
                  <Tile key={variation.label} label={variation.label}>
                    {mark}
                  </Tile>,
                  <Tile
                    key={`${variation.label}-dark`}
                    label={`${variation.label} · on dark`}
                    dark
                  >
                    {mark}
                  </Tile>,
                ];
              })}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
