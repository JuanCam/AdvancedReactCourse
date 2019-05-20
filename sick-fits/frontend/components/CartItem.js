import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTyes from 'prop-types';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyled = styled.li`
list-style: none;
padding: 1rem 0;
border-bottom: 1px solid ${props => props.theme.lightgrey};
display: grid;
align-items: center;
grid-template-columns: auto 1fr auto;
img {
    margin-right: 10px;

}
h3 {
    margin: 0;
}
`;

const cartItemComponent = ({ cartItem }) => {
    if (!cartItem.item) return null;
    return (
    <CartItemStyled>
        <img width="100" src={cartItem.item.image} alt="" />
        <div className="cart-item-details">
            <h3>{cartItem.item.title}</h3>
            <p>
            {formatMoney(cartItem.item.price * cartItem.quantity)}
            &ndash;
            <em>{cartItem.quantity} &times; {formatMoney(cartItem.item.price)}</em>
            </p>
        </div>
        <RemoveFromCart id={cartItem.id}/>
    </CartItemStyled>)
};

cartItemComponent.propTyes = {
    cartItemComponent: PropTyes.shape({
        id: PropTyes.number.isRequired,
        quantity: PropTyes.number.isRequired,
    }).isRequired
}

export default cartItemComponent;