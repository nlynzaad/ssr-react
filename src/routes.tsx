import Env from './pages/Env';
import About from './pages/About';
import Home from './pages/Home';
import App from './App';
import React from 'react';

const routes = [
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
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
