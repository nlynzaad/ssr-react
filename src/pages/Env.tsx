import type { QueryClient } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { todosQuery } from '../queries/todo';
import Title from '../components/Title';

export const envLoader = (queryClient: QueryClient) => async () => {
	const query = todosQuery(2);

	return {
		todo: queryClient.getQueryData(query.queryKey)
			? queryClient.getQueryData(query.queryKey)!
			: queryClient.fetchQuery({ ...query }),
	};
};

export default function Env() {
	return (
		<>
			<h1>ENV</h1>

			<Suspense fallback={<div>loading...</div>}>
				<Title id={2} />
			</Suspense>
		</>
	);
}
