import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunity';
import { Flex, MenuItem, Icon, Text, Box } from '@chakra-ui/react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communities';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
	const [open, setOpen] = useState(false);
	const mySnippets = useRecoilValue(communityState).mySnippets;
	return (
		<>
			<CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
			<Box mt={3} mb={4}>
				<Text pl={3} mb={1} fontSize='7pt' fontWeight={500} color='gray.500'>
					MODERATING
				</Text>
				{mySnippets
					.filter(snippet => snippet.isModerator)
					.map(item => (
						<MenuListItem
							key={item.communityId}
							icon={FaReddit}
							displayText={`r/${item.communityId}`}
							link={`/r/${item.communityId}`}
							iconColor='brand.100'
							imageURL={item.imageURL}
						/>
					))}
			</Box>
			<Box mt={3} mb={4}>
				<Text pl={3} mb={1} fontSize='7pt' fontWeight={500} color='gray.500'>
					MY COMMUNITIES
				</Text>
				<MenuItem width='100%' fontSize='10pt' _hover={{ bg: 'gray.100' }} onClick={() => setOpen(true)}>
					<Flex align={'center'}>
						<Icon fontSize={20} mr={2} as={GrAdd} />
						Create Community
					</Flex>
				</MenuItem>
				{mySnippets.map(item => (
					<MenuListItem
						key={item.communityId}
						icon={FaReddit}
						displayText={`r/${item.communityId}`}
						link={`/r/${item.communityId}`}
						iconColor='blue.500'
						imageURL={item.imageURL}
					/>
				))}
			</Box>
		</>
	);
};
export default Communities;
