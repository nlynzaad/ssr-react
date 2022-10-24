import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function App() {
	return (
		<>
			<nav>
				<ul>
					<Link to={'/'}>Home</Link>
					<Link to={'/env'}>Env</Link>
					<Link to={'/about'}>About</Link>
				</ul>
			</nav>
			<Outlet />
		</>
	);
}
