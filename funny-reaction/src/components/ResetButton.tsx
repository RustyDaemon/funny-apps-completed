interface ResetButtonProps {
	bestTime: number | null;
	worstTime: number | null;
	onReset: () => void;
}

const ResetButton = ({ bestTime, worstTime, onReset }: ResetButtonProps) => {
	if (bestTime === null && worstTime === null) return null;

	return (
		<button
			onClick={onReset}
			className='mt-6 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors'
		>
			Reset Scores
		</button>
	);
};

export default ResetButton;
