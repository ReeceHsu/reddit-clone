import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { BsArrowUpCircle, BsChatDots } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from 'react-icons/io5';

type IconsProps = {};

const Icons: React.FC<IconsProps> = () => {
	return (
		<Flex>
			<Flex display={{ base: 'none', md: 'flex' }} align='center' borderRight='1px solid' borderColor='gray.200'>
				<Flex mr={1.5} ml={1.5} padding={1} cursor={'pointer'} borderRadius={4} _hover={{ bg: 'gray.200' }}>
					<Icon as={BsArrowUpCircle} />
				</Flex>
				<Flex mr={1.5} ml={1.5} padding={1} cursor={'pointer'} borderRadius={4} _hover={{ bg: 'gray.200' }}>
					<Icon as={IoFilterCircleOutline} />
				</Flex>
				<Flex mr={1.5} ml={1.5} padding={1} cursor={'pointer'} borderRadius={4} _hover={{ bg: 'gray.200' }}>
					<Icon as={IoVideocamOutline} />
				</Flex>
			</Flex>
			<>
				<Flex mr={1.5} ml={1.5} padding={1} cursor={'pointer'} borderRadius={4} _hover={{ bg: 'gray.200' }}>
					<Icon as={BsChatDots} />
				</Flex>

				<Flex mr={1.5} ml={1.5} padding={1} cursor={'pointer'} borderRadius={4} _hover={{ bg: 'gray.200' }}>
					<Icon as={IoNotificationsOutline} />
				</Flex>

				<Flex
					display={{ base: 'none', md: 'flex' }}
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					_hover={{ bg: 'gray.200' }}>
					<Icon as={GrAdd} />
				</Flex>
			</>
		</Flex>
	);
};
export default Icons;
