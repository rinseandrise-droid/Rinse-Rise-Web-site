import Link from "next/link";
import { firstOrderOffer } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Welcome",
  description: "Your Rinse & Rise first-order offer is ready.",
  path: "/signup/welcome",
});

export default async function WelcomePage({ searchParams }: PageProps<"/signup/welcome">) {
  const query = await searchParams;
  const next = typeof query.next === "string" && query.next.startsWith("/") ? query.next : "/book";

  return (
    <div className="container-rr max-w-lg py-20 text-center">
      <p className="eyebrow mx-auto justify-center">You&apos;re in</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold">Welcome to Rinse &amp; Rise.</h1>
      <p className="mt-4 text-lg text-muted">Your first-order offer is ready — {firstOrderOffer.percent}% off, applied once at checkout.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={next} className="btn btn-primary">
          Continue
        </Link>
        <Link href="/account" className="btn btn-secondary">
          Go to account
        </Link>
      </div>
    </div>
  );
}
