import "./dashboard.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
