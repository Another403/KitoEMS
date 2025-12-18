import Skeleton from "react-loading-skeleton";

const SummaryCardSkeleton = () => {
	return (
		<div className="flex bg-white rounded shadow animate-pulse">
			<div className="w-16 h-16 bg-gray-300 rounded-l"></div>
			<div className="flex-1 px-4 py-3 space-y-2">
				<div className="h-4 bg-gray-300 rounded w-2/3"></div>
				<div className="h-6 bg-gray-300 rounded w-1/3"></div>
			</div>
		</div>
	);
};

export default SummaryCardSkeleton;