import { Box, Heading } from '@chakra-ui/react';
import CommonLayout from '../components/CommonLayout';
import FilmList from '../components/film/FlilmList';

export default function Main(): React.ReactElement {
	return (
		<CommonLayout>
			<Heading size="lg">최고의 장면을 찾아보세요.</Heading>
			<FilmList/>
		</CommonLayout>
	)
}