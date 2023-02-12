import { Box, BackgroundProps, Flex } from "@chakra-ui/react";
import React, { Children } from 'react';
import Navbar from "./nav/Navbar";

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
				<Navbar />
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

