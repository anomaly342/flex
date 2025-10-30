import "./edit.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="edit-container">{children}</div>
    </div>
  );
}