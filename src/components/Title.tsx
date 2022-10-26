import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { todosQuery } from '../queries/todo';

const Title = ({ id }: { id: number }) => {
	const { data: todo } = useQuery({ ...todosQuery(id) });

	return <p>{todo?.title}</p>;
};

export default Title;
