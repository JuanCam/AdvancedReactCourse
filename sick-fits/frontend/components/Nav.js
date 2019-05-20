import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { Mutation } from 'react-apollo';
import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';
import { TOGGLE_CART_MUTATION } from './Cart';

const nav = props => (
    <User>
        {({data: { me }}) => (
            <NavStyles>
                <Link href="/items">
                    <a>Shop</a>
                </Link>
                {me && (
                    <>
                    <Link href="/sell">
                        <a>Sell</a>
                    </Link>
                    <Link href="/orders">
                        <a>Orders</a>
                    </Link>
                    <Link href="/me">
                        <a>Account</a>
                    </Link>
                    <Signout></Signout>
                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {toggleCart => {
                                return <button onClick={toggleCart}>
                                    My Cart 
                                    <CartCount 
                                        count={me.cart.reduce((nextItem, cartItem) => nextItem + cartItem.quantity, 0)} />
                                </button>}}
                        </Mutation>
                    </>)}
                {!me && <Link href="/signup">
                    <a>Sign In</a>
                </Link>
                }
            </NavStyles>
        )}
    </User>
    );

export default nav;