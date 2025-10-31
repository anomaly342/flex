import "./order_status.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <main className="status-main">
      <section className="status-section">
        <article className="status-article">{children}</article>
      </section>
    </main>
  );
}