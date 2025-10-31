import "./total_order.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <main className="total-order-main">
      <section className="total-order-section">
        <article className="total-order-article">{children}</article>
      </section>
    </main>
  );
}
