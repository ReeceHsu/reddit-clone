import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuList, MenuItem, Flex, Icon, MenuDivider, Text } from '@chakra-ui/react';
import { User, signOut } from 'firebase/auth';
import React from 'react';
import { FaRedditSquare } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { VscAccount } from 'react-icons/vsc';
import { IoSparkles } from 'react-icons/io5';
import { MdOutlineLogout } from 'react-icons/md';
import { auth } from '../../../firebase/clientApp';
import { authModalState } from '../../../atoms/authModalAtom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

type UserMenuProps = {
	user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
	const setAuthModalState = useSetRecoilState(authModalState);

	const logout = async () => {
		await signOut(auth);
	};

	return (
		<Menu>
			<MenuButton
				cursor='pointer'
				padding='0px 6px'
				borderRadius={4}
				_hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
				<Flex alignItems='center'>
					<Flex alignItems={'center'}>
						{user ? (
							<>
								<Icon fontSize={24} mr={1} color='gray.300' as={FaRedditSquare} />
								<Flex
									direction='column'
									alignItems='flex-start'
									display={{ base: 'none', lg: 'flex' }}
									fontSize='8pt'
									mr={8}>
									<Text fontWeight={700}>{user?.displayName || user.email?.split('@')[0]}</Text>
									<Flex>
										<Icon fontSize={12} mr={1} color='brabd.100' as={IoSparkles} />
										<Text color='gray.400'>Karma</Text>
									</Flex>
								</Flex>
							</>
						) : (
							<Icon fontSize={24} color='gray.400' mr={1} as={VscAccount} />
						)}
					</Flex>
					<ChevronDownIcon />
				</Flex>
			</MenuButton>
			<MenuList>
				{user ? (
					<>
						<MenuItem fontSize='10pt' fontWeight={700} _hover={{ bg: 'blue.500', color: 'white' }}>
							<Flex align='center'>
								<Icon fontSize={20} mr={2} as={CgProfile} />
								Porfile
							</Flex>
						</MenuItem>
						<MenuDivider />
						<MenuItem fontSize='10pt' fontWeight={700} _hover={{ bg: 'blue.500', color: 'white' }} onClick={logout}>
							<Flex align='center'>
								<Icon fontSize={20} mr={2} as={MdOutlineLogout} />
								Log Out
							</Flex>
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							fontSize='10pt'
							fontWeight={700}
							_hover={{ bg: 'blue.500', color: 'white' }}
							onClick={() => setAuthModalState({ open: true, view: 'login' })}>
							<Flex align='center'>
								<Icon fontSize={20} mr={2} as={MdOutlineLogout} />
								Log In / Sign Up
							</Flex>
						</MenuItem>
					</>
				)}
			</MenuList>
		</Menu>
	);
};
export default UserMenu;
