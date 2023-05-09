import React from 'react';
import PageContent from '../../../components/Layout/PageContent';
import { Box, Text } from '@chakra-ui/react';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communities';

const SubmitPostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	const communityStateValue = useRecoilValue(communityState);
	return (
		<>
			<PageContent>
				<>
					<Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
						<Text>Create a post</Text>
					</Box>
					{user && <NewPostForm user={user} />}
				</>
				<>
					<div>RHS</div>
				</>
			</PageContent>
		</>
	);
};

export default SubmitPostPage;
