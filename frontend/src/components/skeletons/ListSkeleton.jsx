import React from 'react';
import Skeleton from 'react-loading-skeleton';

import TableSkeleton from './TableSkeleton';

const ListSkeleton = () => {
	return (
		<div className="p-5">
			<div className="text-center mb-4">
				<Skeleton height={32} width={120} />
			</div>

			<div className="flex justify-between mb-4">
				<div className="flex gap-2">
					<Skeleton height={32} width={140} />
					<Skeleton height={32} width={140} />
				</div>
				<Skeleton height={32} width={100} />
			</div>

			<TableSkeleton/>
		</div>
	)
}

export default ListSkeleton
