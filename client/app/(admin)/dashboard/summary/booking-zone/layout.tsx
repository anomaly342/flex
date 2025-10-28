import "./booking_zone.css";

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
