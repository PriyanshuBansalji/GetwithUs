import TechLogo from "@/components/ui/TechLogo";
import { cn } from "@/lib/cn";

/** A tool as a chip: its official mark on a soft tile, then its name. Name only where no mark exists. */
export default function ToolChip({
  name,
  logo,
  className,
}: {
  name: string;
  logo: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-12 items-center gap-2.5 rounded-[14px] border border-line bg-card pr-[18px] text-[0.94rem] font-semibold whitespace-nowrap text-ink",
        logo ? "pl-2" : "pl-[18px]",
        className,
      )}
    >
      {logo ? (
        <span className="grid size-8 place-items-center rounded-[10px] bg-bg-soft">
          <TechLogo slug={logo} size={18} />
        </span>
      ) : null}
      {name}
    </span>
  );
}
