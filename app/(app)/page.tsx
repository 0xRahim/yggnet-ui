import Hero from "@/components/search/Header";
import Dock from "@/components/search/Dock";

export default function Home() {
  return (
    <div className="flex">
      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}