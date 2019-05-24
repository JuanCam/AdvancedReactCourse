import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';
import { ApolloConsumer } from 'react-apollo';
import Router from 'next/router';

const me = fakeUser();

const mocks = [{
        //Sign up mock mutation
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                email: me.email,
                name: me.name,
                password: '1234'
            }
        },
        result: {
            data: {
                __typename: 'User',
                id: 'abc123',
                email: me.email,
                name: me.name
            }
        }
    },   {
        request: {
            query: CURRENT_USER_QUERY
        },
        result: {
            data: { me }
        }
    }
];


describe('<Signup />', () => {

    it('renders and matches snapshot', async () => {
        const wrapper = mount(<MockedProvider>
            <Signup />
        </MockedProvider>);
        const form = wrapper.find('form');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('it calls the mutation properly', async () => {
        let apolloClient;
        
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <ApolloConsumer>
                {client => {
                    apolloClient = client;
                    return <Signup />;
                }}
            </ApolloConsumer>
        </MockedProvider>);

        await wait();
        wrapper.update();
        
        wrapper.find('input[name="email"]').simulate('change', { target: { name: "email", value: me.email } });
        wrapper.find('input[name="name"]').simulate('change', { target: { name: "name", value: me.name } });
        wrapper.find('input[name="password"]').simulate('change', { target: { name: "password", value: '1234' } });
        wrapper.find('form').simulate('submit');

        wrapper.update();

        await wait();

        const user = await apolloClient.query({
            query: CURRENT_USER_QUERY,

        });

        expect(user.data.me).toMatchObject(me);
    });
});