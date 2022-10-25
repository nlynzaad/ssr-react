import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { Request as expressRequest, Response as expressResponse } from 'express';
import { QueryClientProvider, Hydrate, dehydrate, QueryClient, hydrate } from '@tanstack/react-query';
import { unstable_createStaticHandler as createStaticHandler } from '@remix-run/router';
import {
	unstable_createStaticRouter as createStaticRouter,
	unstable_StaticRouterProvider as StaticRouterProvider,
} from 'react-router-dom/server';
import routes from './routes';

const ABORT_DELAY = 5000;

export async function render(request: expressRequest, response: expressResponse, template: string) {
	let didError = false;
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

	const { query } = createStaticHandler(routes(queryClient));
	const remixRequest = createFetchRequest(request);
	const context = await query(remixRequest);

	if (context instanceof globalThis.Response) {
		throw context;
	}

	const dehydratedState = dehydrate(queryClient);
	const router = createStaticRouter(routes(queryClient), context);
	const head = template.split('<div id="root"></div>')[0] + '<div id="root">';
	const tail = '</div>' + template.split('<div id="root"></div>')[1];

	const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState}>
				<StaticRouterProvider router={router} context={context} nonce='rrState' hydrate={true} />
			</Hydrate>
		</QueryClientProvider>,
		{
			onShellReady() {
				response.setHeader('Content-type', 'text/html');
				response.statusCode = didError ? 500 : 200;
				response.write(head);
				pipe(response);
			},
			onShellError(err: unknown) {
				response.statusCode = 500;
				response.send('<!doctype html><p>Error Loading...</p>');
				console.log(err);
			},
			onError(error: unknown) {
				didError = true;

				console.error(error);
			},
			onAllReady() {
				response.write(tail);
				response.write(
					`<script nonce='rqState'>window.__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState).replace(
						/</g,
						'\\u003c'
					)}</script>`
				);
			},
		}
	);
	setTimeout(abort, ABORT_DELAY);
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
