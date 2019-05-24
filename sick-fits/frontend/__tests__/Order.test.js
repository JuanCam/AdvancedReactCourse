import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeOrder } from '../lib/testUtils';
import { ApolloConsumer } from 'react-apollo';

const order = fakeOrder();
const mocks = [{
    request: {
        query: SINGLE_ORDER_QUERY,
        variables: { id: 'ord123' }
    },
    result: {
        data: {
            order
        }
    }
}];

describe('<Order />', () => {

    it('renders and matches snapshot', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <Order id={order.id} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('[data-test="order"]'))).toMatchSnapshot();
    });

    it('should render the items properly', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <Order id={order.id} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(wrapper.find('.items .order-item')).toHaveLength(2);
    });

});