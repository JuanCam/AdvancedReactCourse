import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
mutation createOrder($token: String!) {
    createOrder(token: $token) {
        id
        charge
        total
        items {
            id
            title
        }
    }
}
`;

const totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends React.Component {

    onTokenResponse = async (res, createOrder) => {
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => alert(err));
    };

    render() {
        return (<User>
            {({data:{me}} )=> (
                <Mutation 
                    mutation={CREATE_ORDER_MUTATION}
                    refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                    {(createOrder) => {
                        return <StripeCheckout 
                                amount={calcTotalPrice(me.cart)}
                                name="sick fits"
                                description={`Order of ${totalItems(me.cart)} items!`}
                                image={me.cart[0] && me.cart[0].item.image}
                                stripeKey="pk_test_sEgJcN2LDy4hvCdgGpSXDPgz00JXWVkYaD"
                                currency="USD"
                                email={me.email}
                                token={res => this.onTokenResponse(res, createOrder)}>
                            {this.props.children}
                        </StripeCheckout>
                    }}
                </Mutation>)}
        </User>);
    }
}

export default TakeMyMoney;