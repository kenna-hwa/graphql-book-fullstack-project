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
import SignUp from "./pages/SignUp";



const apolloClient = createApolloClient();

export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/film/:filmId" element={<Film/>} />
        <Route path="/signup" element={<SignUp/>} />

      </Routes>
    </BrowserRouter>
  </ChakraProvider>
  </ApolloProvider>
)
