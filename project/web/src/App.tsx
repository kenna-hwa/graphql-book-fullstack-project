import * as React from "react"
import { ApolloProvider } from "@apollo/client";
import {
  ChakraProvider, theme, Box, Text
} from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FilmList from "./components/film/FlilmList";
import { createApolloClient } from "./apollo/createApolloClient";
import Main from "./pages/Main";
import Film from "./pages/Film";



const apolloClient = createApolloClient();

export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/film/:filmId" element={<Film/>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
  </ApolloProvider>
)
