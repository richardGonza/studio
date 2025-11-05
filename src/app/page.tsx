import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";

export default function Home() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === "hero");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              LexConnect Admin Panel
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Manage users, cases, and volunteers with efficiency and clarity. Your central hub for legal aid coordination.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 md:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
