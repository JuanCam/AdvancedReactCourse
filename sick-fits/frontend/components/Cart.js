import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import User from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import TakeMyMoney from './TakeMyMoney';


const LOCAL_STATE_QUERY = gql`
query {
    cartOpen @client
}
`;

const TOGGLE_CART_MUTATION = gql`
 mutation {
     toggleCart @client
 }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart:({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState:({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})

const cart = props => {
    return (
        <Composed>
        {({user, toggleCart, localState}) => {
            const me = user.data.me;
            if (!me) return null;
            return <CartStyles open={localState.data.cartOpen}>
                <header>
                    <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                    <Supreme>{me.name}'s cart</Supreme>
                    <p>You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your car</p>
                </header>
                <ul>
                    {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
                </ul>
                <footer>
                    <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                    {me.cart.length && <TakeMyMoney>
                        <SickButton>Checkout</SickButton>
                    </TakeMyMoney>}
                </footer>
            </CartStyles>;
        }}
        </Composed>);
};

export default cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };