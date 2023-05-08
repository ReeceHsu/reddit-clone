import React, { useRef, useState } from 'react';
import { Community, communityState } from '../../atoms/communities';
import { Box, Flex, Text, Icon, Stack, Divider, Link, Button, Image, Spinner } from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import dayjs from 'dayjs';
import { CgMenuCake } from 'react-icons/cg';
import { useRouter } from 'next/router';
import { auth, storage, firestore } from '../../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import useSelectFile from '../../hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
	communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const selectFileREf = useRef<HTMLInputElement>(null);
	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
	const [uploadingImage, setUploadingImage] = useState(false);
	const setCommunityStateValue = useSetRecoilState(communityState);

	const onUploadImage = async () => {
		if (!selectedFile) return;
		setUploadingImage(true);
		try {
			const imageRef = ref(storage, `communities/${communityData.id}/image`);
			await uploadString(imageRef, selectedFile, 'data_url');
			const downloadURL = await getDownloadURL(imageRef);
			await updateDoc(doc(firestore, 'communities', communityData.id), { imageURL: downloadURL });
			setCommunityStateValue(prev => ({
				...prev,
				currentCommunity: { ...prev.currentCommunity, imageURL: downloadURL } as Community,
			}));
			setUploadingImage(false);
		} catch (error) {
			console.log('uploadImae error', error);
		}
	};
	return (
		<Box position='sticky' top='14px'>
			<Flex justify={'space-between'} align='center' bg='blue.400' color='white' p={3} borderRadius={'4px 4px 0px 0px'}>
				<Text fontSize='10pt' fontWeight={700}>
					About Community
				</Text>
				<Icon as={HiOutlineDotsHorizontal} />
			</Flex>
			<Flex direction='column' p={3} bg='white' borderRadius='0px 0px 4px 4px'>
				<Stack>
					<Flex width='100%' p={2} fontSize='10pt'>
						<Flex direction='column' flexGrow={1}>
							<Text>{communityData.numberOfMembers.toLocaleString()}</Text>
							<Text>Members</Text>
						</Flex>
						<Flex direction='column' flexGrow={1}>
							<Text>1</Text>
							<Text>Online</Text>
						</Flex>
					</Flex>
					<Divider />
					<Flex align='center' width='100%' p={1} fontWeight={500} fontSize='10pt'>
						<Icon as={CgMenuCake} fontSize={18} mr={2} />
						{communityData.createdAt && (
							<Text>Created {dayjs(new Date(communityData.createdAt.seconds * 1000)).format('MMMM DD, YYYY')}</Text>
						)}
					</Flex>
					<Link href={`/r/${router.query.communityId}/submit`}>
						<Button width='100%' mt={3} height='30px'>
							Create Post
						</Button>
					</Link>
					{user?.uid === communityData.creatorId && (
						<>
							<Divider />
							<Stack spacing={1} fontSize='10pt'>
								<Text fontWeight={600}>Admin</Text>
								<Flex align='center' justify='space-between'>
									<Text
										color='blue.500'
										cursor='pointer'
										_hover={{ textDecoration: 'underline' }}
										onClick={() => selectFileREf.current?.click()}>
										Change Image
									</Text>
									{communityData.imageURL || selectedFile ? (
										<Image
											src={selectedFile || communityData.imageURL}
											borderRadius='full'
											boxSize='40px'
											alt='Community Image'
										/>
									) : (
										<Icon as={FaReddit} fontSize={40} color='brand.100' mr={2} />
									)}
								</Flex>
								{selectedFile &&
									(uploadingImage ? (
										<Spinner />
									) : (
										<Text cursor='pointer' onClick={onUploadImage}>
											Save Changes
										</Text>
									))}
								<input
									id='file-upload'
									type='file'
									hidden
									accept='image/x-png,image/gif,image/jpeg'
									ref={selectFileREf}
									onChange={onSelectFile}
								/>
							</Stack>
						</>
					)}
				</Stack>
			</Flex>
		</Box>
	);
};
export default About;
