import SummaryCardSkeleton from './SummaryCardSkeleton.jsx';

const DashboardSkeleton = () => {
	return (
		<div className="flex">
			<div className="flex-1 ml-64 bg-gray-100 min-h-screen">
				<div className="p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-stretch">
						{Array.from({ length: 6 }).map((_, index) => (
								<SummaryCardSkeleton key={index} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardSkeleton;