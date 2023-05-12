import type { NextPage } from 'next';
import PageContent from '../components/Layout/PageContent';
import { auth, firestore } from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { query } from '@firebase/firestore';
import { collection, getDocs, limit, orderBy, where } from 'firebase/firestore';
import usePosts from '../hooks/usePosts';
import { useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communities';
import { Post, PostVote } from '../atoms/post';
import PostLoader from '../components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '../components/Posts/PostItem';
import CreatePostLink from '../components/Community/CreatePostLink';
import useCommunityData from '../hooks/useCommunityData';

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts();
	const { communityStateValue } = useCommunityData();

	const buildUserHomeFeed = async () => {
		setLoading(true);
		try {
			if (communityStateValue.snippetsFetched) {
				const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId);
				const postQuery = query(collection(firestore, 'posts'), where('communityId', 'in', myCommunityIds), limit(10));
				const postsDocs = await getDocs(postQuery);
				const posts = postsDocs.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setPostStateValue(prev => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error: any) {
			console.log('buildUserHomeFeed error', error.message);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
		console.log('GETTING NO USER FEED');
		setLoading(true);
		try {
			const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10));
			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			console.log('NO USER FEED', posts);

			setPostStateValue(prev => ({
				...prev,
				posts: posts as Post[],
			}));
		} catch (error: any) {
			console.log('getNoUserHomePosts error', error.message);
		}
		setLoading(false);
	};

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map(post => post.id);
			const postVoteQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where('postId', 'in', postIds),
			);
			const postVoteDocs = await getDocs(postVoteQuery);
			const postVotes = postVoteDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			setPostStateValue(prev => ({ ...prev, postVotes: postVotes as PostVote[] }));
		} catch (error: any) {
			console.log('getUserPostVotes error', error.message);
		}
	};

	useEffect(() => {
		if (communityStateValue.snippetsFetched) {
			buildUserHomeFeed();
		}
	}, [communityStateValue.snippetsFetched]);

	// userEffects
	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser]);

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes();

		return () => {
			setPostStateValue(prev => ({ ...prev, postVotes: [] }));
		};
	}, [user, postStateValue.posts]);
	return (
		<PageContent>
			<>
				<CreatePostLink />
				{loading ? (
					<PostLoader />
				) : (
					<Stack>
						{postStateValue.posts.map((post: Post, index) => (
							<PostItem
								key={post.id}
								post={post}
								onVote={onVote}
								onDeletePost={onDeletePost}
								userVoteValue={postStateValue.postVotes.find(item => item.postId === post.id)?.voteValue}
								userIsCreator={user?.uid === post.creatorId}
								onSelectPost={onSelectPost}
								homePage
							/>
						))}
					</Stack>
				)}
			</>
			<></>
		</PageContent>
	);
};

export default Home;
