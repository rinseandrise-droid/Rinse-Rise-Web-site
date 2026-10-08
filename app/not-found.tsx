import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-rr py-24 text-center">
      <p className="eyebrow mx-auto justify-center">404</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold">That page isn&apos;t here.</h1>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </div>
  );
}
