import "./export.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <main className="export-main">
      <section className="export-section">{children}</section>
    </main>
  );
}
