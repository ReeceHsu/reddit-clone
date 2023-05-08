import React, { useState } from 'react';
import { Post } from '../../atoms/post';
import { Flex, Icon, Stack, Text, Image, Skeleton, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from 'react-icons/io5';
import dayjs from 'dayjs';
import { BsChat } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
dayjs.extend(require('dayjs/plugin/relativeTime'));

type PostItemProps = {
	post: Post;
	userIsCreator: boolean;
	userVoteValue?: number;
	onVote: (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string) => void;
	onDeletePost: (post: Post) => Promise<boolean>;
	onSelectPost: () => void;
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
}) => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [loadingDelete, setLoadingDelete] = useState(false);

	const [error, setError] = useState(false);

	const handleDelete = async () => {
		setLoadingDelete(true);
		try {
			const success = await onDeletePost(post);

			if (!success) {
				throw new Error('Faild to delete post');
			}

			console.log('Post was successfully deleted');
		} catch (error: any) {
			setError(error.message);
		}
		setLoadingDelete(false);
	};
	return (
		<Flex
			border='1px solid'
			bg='white'
			borderColor='gray.300'
			_hover={{ borderColor: 'gray.500' }}
			onClick={onSelectPost}>
			<Flex direction={'column'} align={'center'} bg='gray.100' p={2} width='40px' borderRadius={4}>
				<Icon
					as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
					color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
					fontSize={22}
					onClick={e => onVote(e, post, 1, post.communityId)}
					cursor={'pointer'}
				/>
				<Text fontSize='9pt'>{post.voteStatus}</Text>
				<Icon
					as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
					color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
					fontSize={22}
					onClick={e => onVote(e, post, -1, post.communityId)}
					cursor={'pointer'}
				/>
			</Flex>
			<Flex direction={'column'} width={'100%'}>
				{error && (
					<Alert status='error'>
						<AlertIcon />
						<Text mr={2}>{error}</Text>
					</Alert>
				)}
				<Stack spacing={1} p='10px'>
					<Stack direction='row' spacing={0.6} align='center' fontSize='9pt'>
						{/* Home Page Check */}
						<Text>
							Posted by u/{post.creatorDisplayName} {dayjs(new Date(post.createdAt.seconds * 1000)).fromNow()}
						</Text>
					</Stack>
					<Text fontSize={'12pt'} fontWeight={600}>
						{post.title}
					</Text>
					<Text fontSize={'10pt'}>{post.body}</Text>
					{post.imageURL && (
						<Flex justify={'center'} align={'center'} p={2}>
							{loadingImage && <Skeleton height='200px' width='100%' borderRadius={4} />}
							<Image
								src={post.imageURL}
								alt='Post Image'
								maxWidth={'460px'}
								maxHeight={'400px'}
								display={loadingImage ? 'none' : 'unset'}
								onLoad={() => setLoadingImage(false)}
							/>
						</Flex>
					)}
				</Stack>

				<Flex ml={1} mb={0.5} color='gray.500' fontWeight={600}>
					<Flex align={'center'} p='8px 10px' borderRadius={4} _hover={{ bg: 'gray.200' }} cursor='pointer'>
						<Icon as={BsChat} mr={2} />
						<Text fontSize={'9pt'}>{post.numberOfComments}</Text>
					</Flex>
					<Flex align={'center'} p='8px 10px' borderRadius={4} _hover={{ bg: 'gray.200' }} cursor='pointer'>
						<Icon as={IoArrowRedoOutline} mr={2} />
						<Text fontSize={'9pt'}>Share</Text>
					</Flex>
					<Flex align={'center'} p='8px 10px' borderRadius={4} _hover={{ bg: 'gray.200' }} cursor='pointer'>
						<Icon as={IoBookmarkOutline} mr={2} />
						<Text fontSize={'9pt'}>Save</Text>
					</Flex>

					{userIsCreator && (
						<Flex
							align={'center'}
							p='8px 10px'
							borderRadius={4}
							_hover={{ bg: 'gray.200' }}
							cursor='pointer'
							onClick={handleDelete}>
							{loadingDelete ? (
								<Spinner size='sm' />
							) : (
								<>
									<Icon as={MdOutlineDelete} mr={2} />
									<Text fontSize={'9pt'}>Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PostItem;
