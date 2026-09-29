import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { Route } from "@/lib/constants";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 font-body text-[0.6875rem] tracking-wide uppercase transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-ink text-paper hover:bg-ink/85",
        outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
        inverse: "border border-paper text-paper hover:bg-paper hover:text-ink",
        link: "text-ink underline decoration-ink/30 underline-offset-8 hover:decoration-ink",
      },
      size: {
        md: "h-12 px-8",
        sm: "h-10 px-6",
        none: "",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

type ButtonStyleProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonStyleProps & { href: Route | `${Route}/${string}` };
type ButtonAsButton = ButtonStyleProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export default function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
