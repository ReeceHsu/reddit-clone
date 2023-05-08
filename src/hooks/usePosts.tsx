import React from 'react';
import { useRecoilState } from 'recoil';
import { Post, postState, PostVote } from '../atoms/post';
import { deleteObject, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase/clientApp';
import { collection, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const usePosts = () => {
	const [user] = useAuthState(auth);
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

	const onVote = async (
		event: React.MouseEvent<SVGElement, MouseEvent>,
		post: Post,
		vote: number,
		communityId: string,
	) => {
		event.stopPropagation();
		if (!user?.uid) {
			setAuthModalState({ open: true, view: 'login' });
			return;
		}
		try {
			// voteStatus referred to post which user is targeting
			const { voteStatus } = post;
			const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id);

			const batch = writeBatch(firestore);
			// copied to update
			const updatedPost = { ...post };
			const updatedPosts = [...postStateValue.posts];
			let updatedPostVotes = [...postStateValue.postVotes];
			let voteChange = vote;

			// Firet vote
			if (!existingVote) {
				const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`));
				const newVote: PostVote = {
					id: postVoteRef.id,
					postId: post.id!,
					communityId,
					voteValue: vote,
				};

				batch.set(postVoteRef, newVote);
				updatedPost.voteStatus = voteStatus + vote;
				updatedPostVotes = [...updatedPostVotes, newVote];
			} else {
				// Wanat to remove my voted
				const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`);

				// removeing existing vote
				if (existingVote.voteValue === vote) {
					updatedPost.voteStatus = voteStatus - vote;
					updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id);

					batch.delete(postVoteRef);
					voteChange *= -1;
				} else {
					updatedPost.voteStatus = voteStatus + 2 * vote;
					const voteIdx = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id);
					updatedPostVotes[voteIdx] = {
						...existingVote,
						voteValue: vote,
					};
					batch.update(postVoteRef, {
						vote,
					});
				}
			}
			// update state with updated values
			const postIdx = postStateValue.posts.findIndex(item => item.id === post.id);
			updatedPosts[postIdx] = updatedPost;
			setPostStateValue(prev => ({
				...prev,
				posts: updatedPosts,
				postVotes: updatedPostVotes,
			}));

			// update post doc
			const postRef = doc(firestore, 'posts', post.id!);
			batch.update(postRef, { voteStatus: voteStatus + voteChange });

			await batch.commit();
		} catch (error: any) {
			console.log('onVote error', error);
		}
	};

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
function setAuthModalState(arg0: { open: boolean; view: string }) {
	throw new Error('Function not implemented.');
}
