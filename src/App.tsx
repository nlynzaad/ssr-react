import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export default function App() {
	const Style = (isActive: boolean): React.CSSProperties => {
		return { color: isActive ? 'blue' : 'red', marginRight: '5px' };
	};

	return (
		<>
			<nav>
				<ul>
					<NavLink to={'/'} style={({ isActive }) => Style(isActive)} end>
						Home
					</NavLink>
					<NavLink to={'/env'} style={({ isActive }) => Style(isActive)} end>
						Env
					</NavLink>
					<NavLink to={'/about'} style={({ isActive }) => Style(isActive)} end>
						About
					</NavLink>
				</ul>
			</nav>
			<Outlet />
		</>
	);
}
