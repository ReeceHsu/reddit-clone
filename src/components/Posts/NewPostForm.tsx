import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import TabItem from './TabItem';
import TextInput from './PostForm/TextInput';

type NewPostFormProps = {};

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

const NewPostForm: React.FC<NewPostFormProps> = () => {
	const [selectedTab, setSelectedTab] = React.useState(formTabs[0].title);
	const [textInputs, setTextInputs] = React.useState({
		title: '',
		body: '',
	});
	const [selectedFile, setSelectedFile] = React.useState('');
	const [loading, setLoading]= React.useState(false)

	const handleCreatePost = async () => {};

	const onSelectImage = () => {};

	const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
	{
		const { target: { name, value } } = event
		setTextInputs(prev => ({
			...prev,
			[name]: value
		}))
	};
	return (
		<Flex direction={'column'} bg='white' borderRadius={4} mt={2}>
			<Flex width='100% '>
				{formTabs.map(item => (
					<>
						<TabItem item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
					</>
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
			</Flex>
		</Flex>
	);
};
export default NewPostForm;
