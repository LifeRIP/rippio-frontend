// Main.jsx
import { ApolloProvider } from '@apollo/client/react';
import { client } from '@m/core/apollo-client';
// Main.jsx
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { useStart } from './modules/core/hooks/custom-hooks';



function RenderMain({ router }) {
    useStart();

    return (
        <React.StrictMode>
            <ApolloProvider client={client}>
                <RouterProvider router={router} />
            </ApolloProvider>
        </React.StrictMode>
    );
}

export default RenderMain;
