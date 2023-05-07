import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInput from './PostForm/TextInput';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/post';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

type NewPostFormProps = {
	user: User;
};

const formTabs = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Video',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];

export type TabItem = {
	title: string;
	icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = React.useState(formTabs[0].title);
	const [textInputs, setTextInputs] = React.useState({
		title: '',
		body: '',
	});
	const [selectedFile, setSelectedFile] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);

	const handleCreatePost = async () => {
		const { communityId } = router.query;

		// create new post
		const newPost: Post = {
			communityId: communityId as string,
			creatorId: user.uid,
			creatorDisplayName: user.email!.split('@')[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp() as Timestamp,
		};

		setLoading(true);
		try {
			// store the post in db
			const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

			// check for selectedFile
			if (selectedFile) {
				// store in storage => getDownloadURL (return imageURL)
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, 'data_url');
				const downloadURL = await getDownloadURL(imageRef);

				// update post doc by adding imageURL
				await updateDoc(postDocRef, {
					imageURL: downloadURL,
				});
			}

			router.back();
		} catch (error) {
			console.log('handleCreatePost error', error);
			setError(true);
		}
		setLoading(false);
	};

	const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();

		if (event.target.files?.[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}
		reader.onload = readerEvent => {
			if (readerEvent.target?.result) {
				setSelectedFile(readerEvent.target.result as string);
			}
		};
	};

	const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {
			target: { name, value },
		} = event;
		setTextInputs(prev => ({
			...prev,
			[name]: value,
		}));
	};
	return (
		<Flex direction={'column'} bg='white' borderRadius={4} mt={2}>
			<Flex width='100% '>
				{formTabs.map(item => (
					<TabItem key={item.title} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInput
						textInputs={textInputs}
						handleCratePost={handleCreatePost}
						onChanged={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === 'Images & Video' && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelecteImage={onSelectImage}
						setSelectedTab={setSelectedTab}
						setSelectedFile={setSelectedFile}
					/>
				)}
				{error && (
					<Alert status='error'>
						<AlertIcon />
						<Text mr={2}>Error creating post</Text>
					</Alert>
				)}
			</Flex>
		</Flex>
	);
};
export default NewPostForm;
