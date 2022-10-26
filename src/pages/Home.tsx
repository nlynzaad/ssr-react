import { addAndMultiply } from '../add';
import { multiplyAndAdd } from '../multiply';
import React, { Suspense } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { todosQuery, todo } from '../queries/todo';
import Title from '../components/Title';

export const homeLoader = (queryClient: QueryClient) => async () => {
	const query = todosQuery(1);

	return {
		todo: queryClient.getQueryData(query.queryKey)
			? queryClient.getQueryData(query.queryKey)!
			: queryClient.fetchQuery({ ...query }),
	};
};

export default function Home() {
	const { todo } = useLoaderData() as { todo: todo };
	return (
		<div>
			<h1>Home</h1>
			<Suspense fallback={<div>loading...</div>}>
				<Title id={1} />
			</Suspense>
			<div>{addAndMultiply(1, 2, 3)}</div>
			<div>{multiplyAndAdd(1, 2, 3)}</div>
		</div>
	);
}
