import { Box, BackgroundProps, Flex } from "@chakra-ui/react";
import React, { Children } from 'react';

interface CommonLayoutProps {
	bg?: BackgroundProps['bg'];
	children: React.ReactNode;
}

export default function CommonLayout ({
	children,
	bg
}: CommonLayoutProps): React.ReactElement {
	return (
		<div>
			<Flex maxW="960px" justify="center">
				네비게이션 바 자리입니다.
			</Flex>
			<Box
				px={{ base:4 }}
				pt={24}
				mx="auto"
				maxW="960px"
				minH="100vh"
				w="100%"
				bg={bg}
				>
					{children}
				</Box>
		</div>
	)
}

