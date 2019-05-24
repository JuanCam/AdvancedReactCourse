import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveFromCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { ApolloConsumer } from 'react-apollo';

global.alert = console.log;

const mocks = [
    {
        request: {
            query: CURRENT_USER_QUERY,
        },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem({ id: 'abc123' })],
                }
            }
        }
    }, 
    {
    request: {
        query: REMOVE_FROM_CART_MUTATION,
        variables: {
            id: 'abc123'
        }
    },
    result: {
        data: {
            removeFromCart: {
                id: 'abc123',
                __typename: 'CarItem',
            }
        }
    }
}];

describe('<RemoveFromCart />', () => {

    it('renders and matches snapshot', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <RemoveFromCart id="abc123" />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
    });

    it('check it removes the car item', async () => {

        let apolloClient;
        let response;
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <ApolloConsumer>
                {client => {
                    apolloClient = client;
                    return <RemoveFromCart id='abc123' />;
                }}
            </ApolloConsumer>

        </MockedProvider>);

        response = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(response.data.me.cart).toHaveLength(1);
        expect(response.data.me.cart[0].item.price).toBe(5000);

        wrapper.find('button').simulate('click');

        await wait();
        wrapper.update();

        response = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(response.data.me.cart).toHaveLength(0);
    });
});
