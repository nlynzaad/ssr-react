import axios from 'axios';

export interface todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

export const todosQuery = (id: number) => ({
	queryKey: ['todos', 'home', id],
	queryFn: async () => {
		console.log('fetching');
		return (
			await axios.get<todo>(
				`https://flash-the-slow-api.herokuapp.com/delay/random/url/https://jsonplaceholder.typicode.com/todos/${id}`
			)
		).data;
	},
});
