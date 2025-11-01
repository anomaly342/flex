export default function HardLink({
	href,
	children,
	className,
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<a
			className={className}
			href={href}
			onClick={(e) => {
				e.preventDefault();
				window.location.href = href;
			}}
		>
			{children}
		</a>
	);
}
