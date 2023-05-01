import { Flex } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

const PageContent: React.FC<PropsWithChildren> = ({ children }) => {
	console.log(children);
	return (
		<Flex justify={'center'} p='16px 0px' border='1px solid red'>
			<Flex width={'95%'} justify={'center'} maxWidth={'860px'} border='1px solid green'>
				<Flex width={{ base: "100%", md: '65%'}} mr={{ bsae:0, md:6 }} direction={'column'} border='1px solid blue'>
					{children && children[0 as keyof typeof children]}
				</Flex>

				<Flex display={{ base: "none", md: "flex"}} flexGrow={1}  direction={'column'} border='1px solid orange'>
					{children && children[1 as keyof typeof children]}
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PageContent;
