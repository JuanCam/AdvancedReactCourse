import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';


const requestResetMocks = [{
    request: {
        query: REQUEST_RESET_MUTATION,
        variables: { email: 'juan@goog.com' },
    },
    result: {
        data: { requestReset: { message: 'success', __typename: 'Message' } },
    },
}];

describe('<RequestReset />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider>
                <RequestReset />
            </MockedProvider>
        );
        const form = wrapper.find('[data-test="request-reset"]');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('calls the mutation', async () => {
        const wrapper = mount(
            <MockedProvider mocks={requestResetMocks}>
                <RequestReset />
            </MockedProvider>
        );
        //Simulate typing an email and submitting the form
        const input = wrapper.find('input[type="email"]');
        input.simulate('change', { target: { name: 'email', value: 'juan@goog.com'} });
        
        await wait();
        wrapper.update();

        wrapper.find('form').simulate('submit');
        
        await wait();
        wrapper.update();

        expect(wrapper.find('p').text()).toContain('Success in request');

        
    });
});