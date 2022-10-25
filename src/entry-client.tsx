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

const dehydratedQueryState = window.__REACT_QUERY_STATE__;
const dehydratedRouterState = window.__staticRouterHydrationData;

delete window.__REACT_QUERY_STATE__;
delete window.__staticRouterHydrationData;

const elements = Array.from(document.querySelectorAll('script')).filter((el) => {
	return el.nonce && (el.nonce === 'rqState' || el.nonce === 'rrState');
});
elements.find((el) => el.nonce === 'rqState')?.remove();
elements.find((el) => el.nonce === 'rrState')?.remove();

const container = document.getElementById('root');

const router = createBrowserRouter(routes(queryClient), {
	hydrationData: dehydratedRouterState,
});

startTransition(() => {
	ReactDOM.hydrateRoot(
		container!,
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedQueryState}>
				<RouterProvider router={router} fallbackElement={null} />
			</Hydrate>
		</QueryClientProvider>
	);
});
