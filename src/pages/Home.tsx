import { addAndMultiply } from '../add';
import { multiplyAndAdd } from '../multiply';
import React, { Suspense } from 'react';
import Title from '../components/Title';

export default function Home() {
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
