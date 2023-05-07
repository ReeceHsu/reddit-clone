import React from 'react';
import { useRecoilState } from 'recoil';
import { postState } from '../atoms/post';

const usePosts = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

	const onVote = async () => {};

	const onSelectPost = () => {};

	const onDeletePost = async () => {};

	return { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost };
};
export default usePosts;
