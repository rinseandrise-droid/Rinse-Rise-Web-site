import { site } from "@/data/site";

export function Testimonials() {
  return (
    <section className="section">
      <div className="container-rr">
        <p className="eyebrow">Reviews</p>
        <h2 className="section-title mt-3">Tell us how we did.</h2>
        <div className="neo mt-10 max-w-2xl p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-muted">
            Customer quotes will appear here once the shop has collected them. Until then, you can leave a Google
            review after your order.
          </p>
          <a
            href={site.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex font-extrabold text-orange-dark hover:underline"
          >
            Leave a Google review →
          </a>
        </div>
      </div>
    </section>
  );
}
