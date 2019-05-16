import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const nav = props => (
    <User>
        {({data: { me }}) => (
            <NavStyles><Link href="/items">
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
                    </>)}
                {!me && <Link href="/signin">
                    <a>Sign In</a>
                </Link>
                }
            </NavStyles>
        )}
    </User>
    );

export default nav;