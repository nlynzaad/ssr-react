import { add } from './add';

export function multiply(a: number, b: number) {
	return a * b;
}

export function multiplyAndAdd(a: number, b: number, c: number) {
	return add(multiply(a, b), c);
}
