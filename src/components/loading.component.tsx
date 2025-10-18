type LoadingProps = {
	text?: string;
};

export function Loading({ text = 'Loading...' }: LoadingProps) {
	return (
		<div>
			<span className="loading loading-ring loading-xl mr-2"></span>
			<span>{text}</span>
		</div>
	);
}
