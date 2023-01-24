import * as React from "react"
import {
  ChakraProvider, theme, Box, Text
} from "@chakra-ui/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import FilmList from "./components/film/FlilmList";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
})

export const App = () => (
  <ApolloProvider client={apolloClient}>
  <ChakraProvider theme={theme}>
    <Box>
      <Text>Ghibli GraphQL</Text>
      <FilmList />
    </Box>
  </ChakraProvider>
  </ApolloProvider>
)
