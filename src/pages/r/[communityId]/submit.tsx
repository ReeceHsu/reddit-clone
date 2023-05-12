import React from 'react';
import PageContent from '../../../components/Layout/PageContent';
import { Box, Text } from '@chakra-ui/react';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communities';
import About from '../../../components/Community/About';
import useCommunityData from '../../../hooks/useCommunityData';

const SubmitPostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	const communityStateValue = useRecoilValue(communityState);
	const { loading } = useCommunityData();
	return (
		<>
			<PageContent>
				<>
					<Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
						<Text>Create a post</Text>
					</Box>
					{user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL} />}
				</>
				{communityStateValue.currentCommunity && (
					<>
						<About communityData={communityStateValue.currentCommunity} pt={6} onCreatePage loading={loading} />
					</>
				)}
			</PageContent>
		</>
	);
};

export default SubmitPostPage;
