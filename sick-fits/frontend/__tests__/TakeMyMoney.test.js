import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.router = { push() {} };

const mocks = [{
    request: {
        query: CURRENT_USER_QUERY
    },
    result: {
        data: {
            me: {
                ...fakeUser(),
                cart: [fakeCartItem()],
            }
        }
    }
}];

describe('<RemoveFromCart />', () => {

    it('renders and matches snapshot', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <TakeMyMoney></TakeMyMoney>
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot();
    });

    it('creates an order ontoken', async () => {
        const createOrder = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        });

        const wrapper = mount(<MockedProvider mocks={mocks}>
            <TakeMyMoney></TakeMyMoney>
        </MockedProvider>);

        const component = wrapper.find('TakeMyMoney').instance();
        component.onTokenResponse({ id: 'abc123' }, createOrder);
        expect(createOrder).toHaveBeenCalledWith({variables: {token: 'abc123'}});
    });

    it('turns progess bar on', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <TakeMyMoney></TakeMyMoney>
        </MockedProvider>);
        const createOrder = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        });

        await wait();
        wrapper.update();
        NProgress.start = jest.fn();

        const component = wrapper.find('TakeMyMoney').instance();
        component.onTokenResponse({ id: 'abc123' }, createOrder);

        expect(NProgress.start).toHaveBeenCalled();
    });

    it('routes to other page when completed', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <TakeMyMoney></TakeMyMoney>
        </MockedProvider>);
        const createOrder = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        });
        
        Router.router.push = jest.fn();

        const component = wrapper.find('TakeMyMoney').instance();
        component.onTokenResponse({ id: 'abc123' }, createOrder);

        await wait();
        wrapper.update();

        expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/order', query: { id: 'xyz789' } });
    });
});