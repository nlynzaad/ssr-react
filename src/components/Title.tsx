import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { todosQuery } from '../queries/todo';

const Title = ({ id }: { id: number }) => {
	const query = todosQuery(id);
	const queryClient = useQueryClient();
	const { data: todo } = useQuery({
		...query,
		initialData: queryClient.getQueryData(query.queryKey),
	});

	return <p>{todo?.title}</p>;
};

export default Title;
