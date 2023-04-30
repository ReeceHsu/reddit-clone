import { Flex, Icon, Text, Input, Button } from '@chakra-ui/react';
import { BsDot, BsReddit } from 'react-icons/bs';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';

type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState(false);
	const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
	const setAuthModalState = useSetRecoilState(authModalState);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		await sendPasswordResetEmail(email);
		setSuccess(true);
	};
	return (
		<Flex direction='column' alignItems='center' width='100%'>
			<Icon as={BsReddit} color='brand.100' fontSize={40} mb={2} />
			<Text fontWeight={700} mb={2}>
				Reset your password
			</Text>
			{success ? (
				<Text mb={4}>Check your email :)</Text>
			) : (
				<>
					<Text fontSize='sm' textAlign='center' mb={4}>
						Enter the email associated with your account and we'll send you a reset link
					</Text>

					<form onSubmit={onSubmit} style={{ width: '100%' }}>
						<Input
							required
							name='email'
							placeholder='email'
							type='email'
							fontSize='10pt'
							_placeholder={{ color: 'gray.500' }}
							_hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
							_focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
							bg='gray.50'
							onChange={event => {
								setEmail(event.target.value);
							}}
						/>
						<Button width='100%' height='36px' mt={2} mb={2} type='submit'>
							Reset Password
						</Button>
					</form>
					<Flex
						alignItems='center'
						fontSize='9pt'
						color='blue.500'
						fontWeight={700}
						cursor='pointer'
						justifyContent='center'>
						<Text onClick={() => setAuthModalState(prev => ({ ...prev, view: 'login' }))}>LOG IN</Text>
						<Icon as={BsDot} />
						<Text onClick={() => setAuthModalState(prev => ({ ...prev, view: 'signup' }))}>SIGN UP</Text>
					</Flex>
				</>
			)}
		</Flex>
	);
};
export default ResetPassword;
