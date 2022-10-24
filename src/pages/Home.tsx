import axios from 'axios';
import { addAndMultiply } from '../add';
import { multiplyAndAdd } from '../multiply';
import React from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

export const homeLoader =
	(queryClient: QueryClient) =>
	async ({ request }: { request: Request }) => {
		const url = new URL(request.url);
		const q = url.searchParams.get('q');

		let data = await queryClient.getQueryData(['todos', 'home']);

		if (!data) {
			if (typeof window === 'undefined') console.log('server');
			if (typeof window !== 'undefined') console.log('client');
			data = await queryClient.fetchQuery(
				['todos', 'home'],
				async () => {
					const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
					return { title: res.data['title'] };
				},
				{
					cacheTime: 1000 * 60,
					staleTime: 1000 * 60,
				}
			);
		}

		return { data };
	};

export default function Home() {
	let { data } = useLoaderData() as { data: { title: string } };
	return (
		<>
			<h1>Home</h1>
			<p>{data!.title}</p>
			<div>{addAndMultiply(1, 2, 3)}</div>
			<div>{multiplyAndAdd(1, 2, 3)}</div>
		</>
	);
}
