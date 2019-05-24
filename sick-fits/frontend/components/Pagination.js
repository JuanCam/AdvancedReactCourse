import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import Head from 'next/head';
import Link from 'next/link';

const PAGINATION_QUERY = gql`
query PAGINATION_QUERY {
    itemsConnection {
        aggregate {
            count
        }
    }
}
`;

const pagination = props => (
    
        <Query query={PAGINATION_QUERY}>
            {({data, loading, error}) => {
                if (loading) return <p>Loading!</p>;

                const {count} = data.itemsConnection.aggregate;
                const {page} = props;
                const pages =  Math.ceil(count / perPage);
            return <PaginationStyles data-test="pagination">
                        <Head>
                            <title>
                                Sick Fits | page {page} of {pages} 
                            </title>
                        </Head>
                        <Link prefetch href={{pathname: 'items', query: {page: page - 1}}}>
                        <a className="prev" aria-disabled={page <= 1}>&larr; Prev</a>
                        </Link>
                        <p>{count} Items total</p>
                        <Link prefetch href={{ pathname: 'items', query: { page: page + 1 } }}>
                            <a className="next" aria-disabled={page > pages}>Next &rarr;</a>
                        </Link>
                        <p>Page {page} of <span className="totalPages">{pages}</span></p>
                    </PaginationStyles>
            }}
        </Query>
    
);

export default pagination;
export { PAGINATION_QUERY };