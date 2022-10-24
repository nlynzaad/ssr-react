import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			staleTime: 1000 * 60 * 1,
			cacheTime: 1000 * 60 * 5,
		},
	},
});

const dehydratedState = window.__REACT_QUERY_STATE__;
delete window.__REACT_QUERY_STATE__;
const rqstate = document.getElementById('rqstate');
rqstate?.remove();

const container = document.getElementById('app');

const router = createBrowserRouter(routes(queryClient));

startTransition(() => {
	ReactDOM.hydrateRoot(
		container!,
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState}>
				<RouterProvider router={router} fallbackElement={null} />
			</Hydrate>
		</QueryClientProvider>
	);
});
