import "./dashboard.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard-main">
      <section className="dashboard-section">{children}</section>
    </main>
  );
}
