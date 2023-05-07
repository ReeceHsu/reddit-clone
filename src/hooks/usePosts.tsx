import React from 'react';
import { useRecoilState } from 'recoil';
import { Post, postState } from '../atoms/post';
import { deleteObject, ref } from 'firebase/storage';
import { firestore, storage } from '../firebase/clientApp';
import { deleteDoc, doc } from 'firebase/firestore';

const usePosts = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

	const onVote = async () => {};

	const onSelectPost = () => {};

	const onDeletePost = async (post: Post): Promise<boolean> => {
		try {
			// check if image, delte if exists
			if (post.imageURL) {
				const imageRef = ref(storage, `posts/${post.id}/image`);
				await deleteObject(imageRef);
			}
			// delte post docuemnt from firestore
			const postDocRef = doc(firestore, 'posts', post.id as string);
			await deleteDoc(postDocRef);

			setPostStateValue(prev => ({
				...prev,
				posts: prev.posts.filter(item => item.id !== post.id),
			}));

			return true;
		} catch (error) {
			return false;
		}
	};

	return { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost };
};
export default usePosts;
