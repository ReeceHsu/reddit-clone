import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom';

type TypeName = {};

const AuthButtons: React.FC<TypeName> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	return (
		<>
			<Button
				variant='outline'
				height='28px'
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				mr={2}
				onClick={() => setAuthModalState({ open: true, view: 'login' })}>
				Log In
			</Button>
			<Button
				onClick={() => setAuthModalState({ open: true, view: 'signup' })}
				height='28px'
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				mr={2}>
				Sign Up
			</Button>
		</>
	);
};

export default AuthButtons;
