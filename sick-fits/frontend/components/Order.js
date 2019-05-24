import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Head from 'next/head';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import { Query } from 'react-apollo';
import formatMoney from '../lib/formatMoney';
import { format } from 'date-fns';

const SINGLE_ORDER_QUERY = gql`
query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
        id
        charge
        total
        createdAt
        user {
            id
        }
        items {
            id
            title
            description
            price
            image
            quantity
        }
    }
}
`;

class Order extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
    }

    render() {
        return <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
            {({data, error, loading}) => {
                if (error) return error;
                if (loading) return <p>Loading...</p>;

                const { order } = data;
                return <div data-test="order"><OrderStyles>
                    <Head>
                        <title>Sick Fits - Order {order.title}</title>
                    </Head>
                    <p>
                        <span>Order ID:</span>
                        <span>{this.props.id}</span>
                    </p>
                    <p>
                        <span>Charge:</span>
                        <span>{order.charge}</span>
                    </p>
                    <p>
                        <span>Date:</span>
                        <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                    </p>
                    <p>
                        <span>Order Total:</span>
                        <span>{formatMoney(order.total)}</span>
                    </p>
                    <p>
                        <span>Order count:</span>
                        <span>{order.items.length}</span>
                    </p>
                    <div className="items">
                        {order.items.map(item => (<div className='order-item' key={item.id}>
                                {item.name}
                                <img src={item.image} alt={item.title}/>
                                <div className="item-details">
                                    <h2>{item.title}</h2>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Each: {item.price}</p>
                                    <p>Subtotal: {item.price * item.quantity}</p>
                                    <p>{item.description}</p>
                                </div>
                            </div>))}
                    </div>
                </OrderStyles></div>
            }}
        </Query>;
    }
}

export default Order;
export { SINGLE_ORDER_QUERY };