import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Post, postState } from '../../../atoms/post';
import CommentInput from './CommentInput';
import {
	collection,
	doc,
	getDocs,
	increment,
	orderBy,
	query,
	serverTimestamp,
	where,
	writeBatch,
} from 'firebase/firestore';
import { firestore } from '../../../firebase/clientApp';
import { Timestamp } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import CommentItem from './CommentItem';

type CommentsProps = {
	user: User;
	selectedPost: Post | null;
	communityId: string;
};

export type Comment = {
	id: string;
	creatorId: string;
	creatorDisplayText: string;
	communityId: string;
	postId: string;
	postTitle: string;
	createdAt: Timestamp;
	text: string;
};

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
	const [commentText, setCommentText] = useState('');
	const [comments, setComments] = useState<Comment[]>([]);
	const [fetchLoading, setFetchLoading] = useState(true);
	const [createLoading, setCreateLoading] = useState(false);
	const [loadingDelteId, setLoadingDelteId] = useState('');
	const setPostState = useSetRecoilState(postState);

	const onCreateComment = async (commentText: string) => {
		// create a comment document
		// update post numberOfComments
		setCreateLoading(true);
		try {
			const batch = writeBatch(firestore);

			const commentDocRef = doc(collection(firestore, 'comments'));

			const newComment: Comment = {
				id: commentDocRef.id,
				creatorId: user.uid,
				creatorDisplayText: user.email!.split('@')[0],
				communityId,
				postId: selectedPost?.id!,
				postTitle: selectedPost?.title!,
				text: commentText,
				createdAt: serverTimestamp() as Timestamp,
			};
			batch.set(commentDocRef, newComment);

			newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

			const postDocRef = doc(firestore, 'posts', selectedPost?.id as string);
			batch.update(postDocRef, {
				numberOfComments: increment(1),
			});

			await batch.commit();

			setCommentText('');
			setComments(prev => [newComment, ...prev]);
			setPostState(prev => ({
				...prev,
				selectedPost: {
					...prev.selectedPost,
					numberOfComments: prev.selectedPost?.numberOfComments! + 1,
				} as Post,
			}));
		} catch (error) {
			console.log('onCreateComment error', error);
		}
		setCreateLoading(false);
	};

	const onDeleteComment = async (comment: Comment) => {
		setLoadingDelteId(comment.communityId);
		try {
			const batch = writeBatch(firestore);

			const commentDocRef = doc(firestore, 'comments', comment.id);
			batch.delete(commentDocRef);

			const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
			batch.update(postDocRef, {
				numberOfComments: increment(-1),
			});

			await batch.commit();

			// update client state
			setPostState(prev => ({
				...prev,
				selectedPost: {
					...prev.selectedPost,
					numberOfComments: prev.selectedPost?.numberOfComments! - 1,
				} as Post,
				postUpdateRequired: true,
			}));

			setComments(prev => prev.filter(item => item.id !== comment.id));
		} catch (error) {
			console.log('onDeleteComment error', error);
		}
	};

	const getPostComments = async () => {
		try {
			const commentsQuery = query(
				collection(firestore, 'comments'),
				where('postId', '==', selectedPost?.id),
				orderBy('createdAt', 'desc'),
			);
			const commentDocs = await getDocs(commentsQuery);
			const comments = commentDocs.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setComments(comments as Comment[]);
		} catch (error: any) {
			console.log('getPostComments error', error.message);
		}
		setFetchLoading(false);
	};
	useEffect(() => {
		if (!selectedPost) return;
		getPostComments();
	}, [selectedPost]);
	return (
		<Box bg='white' borderRadius='0px 0px 4px 4px' p={2}>
			<Flex direction='column' pl={10} pr={4} mb={6} fontSize='10pt' width='100%'>
				<CommentInput
					commentText={commentText}
					createLoading={createLoading}
					onCreateComment={onCreateComment}
					setCommentText={setCommentText}
					user={user}
				/>
			</Flex>
			<Stack spacing={6} p={2}>
				{fetchLoading ? (
					<>
						{[0, 1, 2].map(item => (
							<Box key={item} padding='6' bg='white'>
								<SkeletonCircle size='10' />
								<SkeletonText mt='4' noOfLines={2} spacing='4' />
							</Box>
						))}
					</>
				) : (
					<>
						{!!comments.length ? (
							<>
								{comments.map((item: Comment) => (
									<CommentItem
										key={item.id}
										comment={item}
										onDeleteComment={onDeleteComment}
										loadingDelete={false}
										userId={user?.uid}
									/>
								))}
							</>
						) : (
							<Flex
								direction='column'
								justify='center'
								align='center'
								borderTop='1px solid'
								borderColor='gray.100'
								p={20}>
								<Text fontWeight={700} opacity={0.3}>
									No Comments Yet
								</Text>
							</Flex>
						)}
					</>
				)}
			</Stack>
		</Box>
	);
};
export default Comments;
