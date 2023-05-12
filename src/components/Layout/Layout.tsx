import Navbar from '../Navbar/Navbar';
import { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
};

export default Layout;
