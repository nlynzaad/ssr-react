import axios from 'axios';

export interface todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

export const todosQuery = (id: number) => ({
	queryKey: ['todos', 'home', id],
	queryFn: async () =>
		(
			await axios.get<todo>(
				`https://flash-the-slow-api.herokuapp.com/delay/1000/url/https://jsonplaceholder.typicode.com/todos/${id}`
			)
		).data,
});
