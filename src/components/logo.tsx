import Image from "next/image";

export function Logo() {
  return (
    <div className="flex h-16 items-center justify-center p-2">
      <Image
        src="/logopep.png"
        alt="Credipep Logo"
        width={140}
        height={45}
        priority
      />
    </div>
  );
}
