import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';
import styled from 'styled-components';

const REMOVE_FROM_CART_MUTATION = gql`
 mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
     removeFromCart(id: $id) {
         id
     }
 }
`;

const BigButton = styled.button`
 font-size: 3rem;
 background: none;
 border: 0;
 &:hover {
     color: ${props => props.theme.red};
     cursor: pointer;
 }
`;

class RemoveFromCart extends React.Component {
    static propTypes ={
        id: PropTypes.string.isRequired,

    };

    // This gets called as soon as we get a response
    // from the server after the mutation has been performed
    update = (cache, payload) => {
        const data = cache.readQuery({query: CURRENT_USER_QUERY});
        const carItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => carItemId !== cartItem.id);
        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
        
    }

    render() {
        const { id } = this.props;
        
        return <Mutation 
                    mutation={REMOVE_FROM_CART_MUTATION} 
                    variables={{ id }} 
                    update={this.update}
                    optimisticResponse={{
                        __typename: 'Mutation',
                        removeFromCart: {
                            __typename: 'CartItem',
                            id
                        }
                    }}>
            {(removeFromCart, {loading}) => <BigButton title="Delete item" disabled={loading} onClick={() => {
                removeFromCart().catch(err => alert(err));
                }}>&times;</BigButton>}
               </Mutation>
    }
}

export default RemoveFromCart;
export { REMOVE_FROM_CART_MUTATION };
