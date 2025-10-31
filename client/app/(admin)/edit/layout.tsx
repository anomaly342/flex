import "./edit.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className="edit-container">{children}</section>
    </main>
  );
}