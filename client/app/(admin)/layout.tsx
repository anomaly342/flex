import './admin.css'

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='admin-container'>{children}</div>
    </div>
  );
}