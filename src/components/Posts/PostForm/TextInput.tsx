import { Stack, Input, Textarea, Flex, Button } from '@chakra-ui/react';
import React from 'react';

type TextInputProps = {
	textInputs: {
		title: string;
		body: string;
	};
	onChanged: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleCratePost: () => void;
	loading: boolean;
};

const TextInput: React.FC<TextInputProps> = ({ textInputs, onChanged, handleCratePost, loading }) => {
	return (
		<Stack spacing={3} width='100%'>
			<Input
				name='title'
				value={textInputs.title}
				onChange={onChanged}
				fontSize='10pt'
				borderRadius={4}
				placeholder='Title'
				_placeholder={{ color: 'gray.500' }}
				_focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'black' }}
			/>
			<Textarea
				name='body'
				value={textInputs.body}
				onChange={onChanged}
				fontSize='10pt'
				borderRadius={4}
				height='100px'
				placeholder='Text (optional)'
				_placeholder={{ color: 'gray.500' }}
				_focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'black' }}
			/>
			<Flex justify='flex-end'>
				<Button height='34px' padding='0px 30px' disabled={!textInputs.title} onClick={handleCratePost} isLoading={loading}>
					Post
				</Button>
			</Flex>
		</Stack>
	);
};
export default TextInput;
