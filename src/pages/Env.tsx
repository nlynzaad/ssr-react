import React, { Suspense } from 'react';
import Title from '../components/Title';

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
