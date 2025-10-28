import './main.css'

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main-container'>{children}</div>
    </div>
  );
}