import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';
import Router from 'next/router';

const mockImageUrl = 'https://dog.com/dog.jpg';

// Mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: mockImageUrl,
        eager: [{ secure_url: mockImageUrl }]
    })
});

describe('<CreateItem />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);
        const form = wrapper.find('form');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('uploads a file when changed', async () => {

        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);

        const input = wrapper.find('input[type="file"]');
        input.simulate('change', { target: { files: [mockImageUrl] } });
        await wait();
        const component = wrapper.find('CreateItem').instance();
        expect(component.state.image).toEqual(mockImageUrl);
        expect(component.state.largeImage).toEqual(mockImageUrl);
        expect(global.fetch).toHaveBeenCalled();
        global.fetch.mockReset();
    });

    it('hanldes state updating', async () => {

        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);

        wrapper.find('#title').simulate('change', { target: { value: 'testing', name: 'title' } });
        wrapper.find('#price').simulate('change', { target: { value: 50000, name: 'price' } });
        wrapper.find('#description').simulate('change', { target: { value: 'This is the description', name: 'description' } });

        expect(wrapper.find('CreateItem').instance().state)
            .toMatchObject({ 
                title: 'testing',
                price: 50000,
                description: 'This is the description' 
            });

    });

    it('creates the item when the form is submitted', async () => {
        const item= fakeItem();
        const { description, title, price } = item;
        const mocks = [
            {
                request: {
                    query: CREATE_ITEM_MUTATION,
                    variables: {
                        title,
                        description,
                        price,
                        image: '',
                        largeImage: '',
                    }
                },
                result: {
                    data: {
                        createItem: {
                            ...item
                        }
                    }
                }
            }
        ];


        const wrapper = mount(<MockedProvider mocks={mocks}>
            <CreateItem />
        </MockedProvider>);

        wrapper.find('#title').simulate('change', { target: { value: title, name: 'title' } });
        wrapper.find('#price').simulate('change', { target: { value: price, name: 'price' } });
        wrapper.find('#description').simulate('change', { target: { value: description, name: 'description' } });

        Router.router = { push: jest.fn() };
        wrapper.find('form').simulate('submit');

        await wait(50);
        wrapper.update();

        expect(Router.router.push).toHaveBeenCalledWith({ pathname:'/item', query: {id: item.id} });
    });
});
