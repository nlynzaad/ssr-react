import Env from './pages/Env';
import About from './pages/About';
import Home, { homeLoader } from './pages/Home';
import type { QueryClient } from '@tanstack/react-query';
import type { RouteObject } from 'react-router-dom';
import App from './App';
import React from 'react';

const routes = (queryClient: QueryClient): RouteObject[] => [
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				loader: homeLoader(queryClient),
				element: <Home />,
			},
			{
				path: 'about',
				element: <About />,
			},
			{
				path: 'env',
				element: <Env />,
			},
		],
	},
];

export default routes;
