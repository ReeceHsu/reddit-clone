import { Flex } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

const PageContent: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<Flex justify={'center'} p='16px 0px'>
			<Flex width={'95%'} justify={'center'} maxWidth={'860px'}>
				<Flex width={{ base: '100%', md: '65%' }} mr={{ base: 'none', md: 6 }} direction={'column'}>
					{children && children[0 as keyof typeof children]}
				</Flex>

				<Flex display={{ base: 'none', md: 'flex' }} flexGrow={1} direction={'column'}>
					{children && children[1 as keyof typeof children]}
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PageContent;
