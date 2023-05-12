import React, { useRef, useState } from 'react';
import { Community, communityState } from '../../atoms/communities';
import {
	Box,
	Flex,
	Text,
	Icon,
	Stack,
	Divider,
	Link,
	Button,
	Image,
	Spinner,
	Skeleton,
	SkeletonCircle,
} from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import dayjs from '../../utilits/Dayjs';
import { CgMenuCake } from 'react-icons/cg';
import { auth, storage, firestore } from '../../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import useSelectFile from '../../hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import router from 'next/router';

type AboutProps = {
	communityData: Community;
	pt?: number;
	onCreatePage?: boolean;
	loading?: boolean;
};

const About: React.FC<AboutProps> = ({ communityData, pt, onCreatePage, loading }) => {
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
		} catch (error) {
			console.log('uploadImae error', error);
		}
		setUploadingImage(false);
	};
	return (
		<Box pt={pt} position='sticky' top='14px'>
			<Flex justify='space-between' align='center' p={3} color='white' bg='blue.400' borderRadius='4px 4px 0px 0px'>
				<Text fontSize='10pt' fontWeight={700}>
					About Community
				</Text>
				<Icon as={HiOutlineDotsHorizontal} cursor='pointer' />
			</Flex>
			<Flex direction='column' p={3} bg='white' borderRadius='0px 0px 4px 4px'>
				{loading ? (
					<Stack mt={2}>
						<SkeletonCircle size='10' />
						<Skeleton height='10px' />
						<Skeleton height='20px' />
						<Skeleton height='20px' />
						<Skeleton height='20px' />
					</Stack>
				) : (
					<>
						<Stack spacing={2}>
							<Flex width='100%' p={2} fontWeight={600} fontSize='10pt'>
								<Flex direction='column' flexGrow={1}>
									<Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
									<Text>Members</Text>
								</Flex>
								<Flex direction='column' flexGrow={1}>
									<Text>1</Text>
									<Text>Online</Text>
								</Flex>
							</Flex>
							<Divider />
							<Flex align='center' width='100%' p={1} fontWeight={500} fontSize='10pt'>
								<Icon as={CgMenuCake} mr={2} fontSize={18} />
								{communityData?.createdAt && (
									<Text>Created {dayjs(new Date(communityData.createdAt!.seconds * 1000)).format('MMM DD, YYYY')}</Text>
								)}
							</Flex>
							{!onCreatePage && (
								<Link href={`/r/${router.query.community}/submit`}>
									<Button mt={3} height='30px' width='100%'>
										Create Post
									</Button>
								</Link>
							)}
							{/* !!!ADDED AT THE VERY END!!! INITIALLY DOES NOT EXIST */}
							{user?.uid === communityData?.creatorId && (
								<>
									<Divider />
									<Stack fontSize='10pt' spacing={1}>
										<Text fontWeight={600}>Admin</Text>
										<Flex align='center' justify='space-between'>
											<Text
												color='blue.500'
												cursor='pointer'
												_hover={{ textDecoration: 'underline' }}
												onClick={() => selectFileREf.current?.click()}>
												Change Image
											</Text>
											{communityData?.imageURL || selectedFile ? (
												<Image
													borderRadius='full'
													boxSize='40px'
													src={selectedFile || communityData?.imageURL}
													alt='Dan Abramov'
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
											accept='image/x-png,image/gif,image/jpeg'
											hidden
											ref={selectFileREf}
											onChange={onSelectFile}
										/>
									</Stack>
								</>
							)}
						</Stack>
					</>
				)}
			</Flex>
		</Box>
	);
};
export default About;
