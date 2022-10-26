import Env, { envLoader } from './pages/Env';
import About from './pages/About';
import Home, { homeLoader } from './pages/Home';
import App from './App';
import React from 'react';
import type { QueryClient } from '@tanstack/react-query';

const routes = (queryClient: QueryClient) => [
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Home />,
				loader: homeLoader(queryClient),
			},
			{
				path: 'about',
				element: <About />,
			},
			{
				path: 'env',
				element: <Env />,
				loader: envLoader(queryClient),
			},
		],
	},
];

export default routes;
