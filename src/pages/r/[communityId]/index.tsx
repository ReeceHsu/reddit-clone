import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { firestore } from '../../../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Community } from '../../../atoms/communities';
import safeJsonStringify from 'safe-json-stringify';
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';

type CommunityPageProps = {
	communityData: Community;
};

const CommmunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	if (!communityData) return <NotFound />;
	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<><div>LHS</div></>
				<><div>RHS</div></>
			</PageContent>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);

		const communityDoc = await getDoc(communityDocRef);
		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }), // needed for dates
					  )
					: '',
			},
		};
	} catch (error) {
		console.log('getServerSideProps error - [community]', error);
	}
}

export default CommmunityPage;
