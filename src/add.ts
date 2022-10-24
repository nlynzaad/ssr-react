import { multiply } from './multiply';

export function add(a: number, b: number) {
	return a + b;
}

export function addAndMultiply(a: number, b: number, c: number) {
	return multiply(add(a, b), c);
}
