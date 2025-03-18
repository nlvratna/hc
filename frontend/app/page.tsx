import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full items-center justify-center p-6 md:p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Health Connect</h1>
        <Button
          asChild
          className="rounded-md bg-black text-white hover:bg-black/90"
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
