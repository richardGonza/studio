import { Scale } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Scale className="h-6 w-6" />
      <span className="font-headline text-lg font-semibold">
        LexConnect
      </span>
    </div>
  );
}
