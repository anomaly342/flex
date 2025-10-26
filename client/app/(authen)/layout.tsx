import './authen.css'

export default function noHeader({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='authen-container'>{children}</div>
    </div>
  );
}