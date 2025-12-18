import Skeleton from 'react-loading-skeleton';

const TableSkeleton = ({ rows = 5 }) => {
	return (
		<div className="space-y-3 mt-5">
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className="grid grid-cols-6 gap-4 items-center"
				>
					<Skeleton height={20} />
					<Skeleton height={20} />
					<Skeleton height={20} />
					<Skeleton height={20} />
					<Skeleton height={20} />
					<Skeleton height={30} />
				</div>
			))}
		</div>
	);
};

export default TableSkeleton;