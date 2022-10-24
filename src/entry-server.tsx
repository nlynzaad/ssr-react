import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { Request as expressRequest } from 'express';
import { QueryClientProvider, Hydrate, dehydrate, QueryClient, hydrate } from '@tanstack/react-query';
import { unstable_createStaticHandler as createStaticHandler } from '@remix-run/router';
import {
	unstable_createStaticRouter as createStaticRouter,
	unstable_StaticRouterProvider as StaticRouterProvider,
} from 'react-router-dom/server';
import routes from './routes';

export async function render(request: expressRequest) {
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

	let { query } = createStaticHandler(routes(queryClient));
	let remixRequest = createFetchRequest(request);
	let context = await query(remixRequest);

	if (context instanceof globalThis.Response) {
		throw context;
	}

	let dehydratedState = dehydrate(queryClient);

	let router = createStaticRouter(routes(queryClient), context);

	const appHtml = ReactDOMServer.renderToString(
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState}>
				<StaticRouterProvider router={router} context={context} nonce='the-nonce' />
			</Hydrate>
		</QueryClientProvider>
	);

	dehydratedState = dehydrate(queryClient);

	const rqHydrate = `<script id="rqstate">
								window.__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState ?? '{}').replace(/</g, '\\u003c')}
							</script>`;

	return { appHtml, rqHydrate };
}

export function createFetchHeaders(requestHeaders: expressRequest['headers']): Headers {
	let headers = new Headers();

	for (let [key, values] of Object.entries(requestHeaders)) {
		if (values) {
			if (Array.isArray(values)) {
				for (let value of values) {
					headers.append(key, value);
				}
			} else {
				headers.set(key, values);
			}
		}
	}

	return headers;
}

export function createFetchRequest(req: expressRequest): Request {
	let origin = `${req.protocol}://${req.get('host')}`;
	// Note: This had to take originalUrl into account for presumably vite's proxying
	let url = new URL(req.originalUrl || req.url, origin);

	let controller = new AbortController();

	req.on('close', () => {
		controller.abort();
	});

	let init: RequestInit = {
		method: req.method,
		headers: createFetchHeaders(req.headers),
		signal: controller.signal,
	};

	if (req.method !== 'GET' && req.method !== 'HEAD') {
		init.body = req.body;
	}

	return new Request(url.href, init);
}
