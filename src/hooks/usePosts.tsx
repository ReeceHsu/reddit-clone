import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postState, PostVote } from '../atoms/post';
import { deleteObject, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase/clientApp';
import { collection, deleteDoc, doc, query, where, writeBatch, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authModalState } from '../atoms/authModalAtom';
import { communityState } from '../atoms/communities';
import { useRouter } from 'next/router';

const usePosts = () => {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const setAuthModalState = useSetRecoilState(authModalState);
	const currentCommunity = useRecoilValue(communityState).currentCommunity;

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

			if (postStateValue.selectedPost) {

			}

			// update post doc
			const postRef = doc(firestore, 'posts', post.id!);
			batch.update(postRef, { voteStatus: voteStatus + voteChange });

			await batch.commit();
		} catch (error: any) {
			console.log('onVote error', error);
		}
	};

	const onSelectPost = (post: Post) => {
		setPostStateValue(prev => ({
			...prev,
			selectedPost: post,
		}));
		router.push(`/r/${post.communityId}/comments/${post.id}`);
	};

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

	const getCommunityPostVote = async (communityId: string) => {
		const postVotesQuery = query(
			collection(firestore, 'users', `${user?.uid}/postVotes`),
			where('communityId', '==', communityId),
		);

		const postVotesDoc = await getDocs(postVotesQuery);
		const postVotes = postVotesDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		setPostStateValue(prev => ({ ...prev, postVotes: postVotes as PostVote[] }));
	};

	useEffect(() => {
		if (!user || !currentCommunity?.id) return;
		getCommunityPostVote(currentCommunity?.id);
	}, [currentCommunity]);

	useEffect(() => {
		if (!user) {
			// clear user post votes
			setPostStateValue(prev => ({ ...prev, postVotes: [] }));
		}
	}, [user]);

	return { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost, getCommunityPostVote };
};
export default usePosts;
