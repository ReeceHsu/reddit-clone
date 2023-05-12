import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Divider,
	Text,
	Input,
	Checkbox,
	Flex,
	Stack,
	Icon,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { auth, firestore } from '../../../firebase/clientApp';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import useDirectory from '../../../hooks/useDirectory';
import { useRouter } from 'next/router';

type CreateCommunityProps = {
	open: boolean;
	handleClose: () => void;
};

const CreateCommunity: React.FC<CreateCommunityProps> = ({ open, handleClose }) => {
	const [user] = useAuthState(auth);
	const [communityName, setCommnuityName] = useState('');
	const [charsRemaining, setCharsRemaining] = useState(20);
	const [communityType, setCommunityType] = useState('public');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { toggleMenuOpen } = useDirectory();
	const router = useRouter();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 21) return;
		setCommnuityName(event.target.value);

		setCharsRemaining(21 - event.target.value.length);
	};

	const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCommunityType(event.target.name);
	};

	const handleCreateCommunity = async () => {
		if (error) setError('');
		if (communityName.length < 3) {
			setError('Community name must be at least 3 characters long');
			return;
		}

		setLoading(true);

		try {
			const communityDocRef = doc(firestore, 'communities', communityName);

			// handle transaction
			await runTransaction(firestore, async transaction => {
				// Check if community exists in db
				const communityDoc = await transaction.get(communityDocRef);
				if (communityDoc.exists()) {
					throw new Error(`Sorry, r/' ${communityName} already exists`);
				}

				// create community
				transaction.set(communityDocRef, {
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberOfMembers: 1,
					privacyType: communityType,
				});

				// create communitySnippet on user
				transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
					communityId: communityName,
					isModerator: true,
				});
			});
			router.push(`/r/${communityName}`);
			handleClose();
			toggleMenuOpen();
		} catch (error: any) {
			console.log('handleCreateCommunity err', error);
			setError(error.message);
		}

		setLoading(false);
	};
	return (
		<>
			<Modal isOpen={open} onClose={handleClose} size='lg'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader display='flex' flexDirection='column' fontSize={15} padding={3}>
						Creacte a community
					</ModalHeader>
					<Box pl={3} pr={3}>
						<Divider />
						<ModalCloseButton />
						<ModalBody display='flex' flexDirection='column' padding='10px 0px'>
							<Text fontWeight={600} fontSize={15}>
								Name
							</Text>
							<Text fontSize={11} color='gray.500'>
								Community Name including capitalization cannot be changed{' '}
							</Text>
							<Text top='28px' position='relative' left='10px' width='20px' color='gray.400'>
								r/
							</Text>
							<Input position='relative' value={communityName} size='sm' pl='22px' onChange={handleChange} />
							<Text fontSize='9pt' color={charsRemaining === 0 ? 'red' : 'gray.500'}>
								{charsRemaining} Characters remaining
							</Text>
							<Text fontSize='9pt'>{error}</Text>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Community Type
								</Text>
								<Stack spacing={2}>
									<Checkbox name='public' isChecked={communityType === 'public'} onChange={onCommunityTypeChange}>
										<Flex align='center'>
											<Icon as={BsFillPersonFill} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Public
											</Text>
											<Text fontSize='8pt' color='gray.500' pt={1}>
												Anyone can view, post, and comment to this community
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name='restricated'
										isChecked={communityType === 'restricated'}
										onChange={onCommunityTypeChange}>
										<Flex align='center'>
											<Icon as={BsFillEyeFill} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Restricated
											</Text>
											<Text fontSize='8pt' color='gray.500' pt={1}>
												Anyone can view this community, but only approved users can post
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox name='private' isChecked={communityType === 'private'} onChange={onCommunityTypeChange}>
										<Flex align='center'>
											<Icon as={HiLockClosed} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Private
											</Text>
											<Text fontSize='8pt' color='gray.500' pt={1}>
												Only approved users can view and submit to this community
											</Text>
										</Flex>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>

					<ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
						<Button variant='outline' height='30px' colorScheme='blue' mr={3} onClick={handleClose}>
							Cancel
						</Button>
						<Button height='30px' onClick={handleCreateCommunity} isLoading={loading}>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default CreateCommunity;
