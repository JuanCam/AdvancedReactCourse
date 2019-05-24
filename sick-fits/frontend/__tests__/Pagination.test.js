import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import PaginationComponent, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';
import { request } from 'http';
import Router from 'next/router';

Router.router = {
    push() {},
    prefetch() {},
};

const makeMocksFor = (pageLength) => {
    return [
        {
            request: { query: PAGINATION_QUERY },
            result: {
                data: {
                    itemsConnection: {
                        __typename: 'aggregate',
                        aggregate: {
                            count: pageLength,
                            __typename: 'count',
                        }
                    }
                }
            }
        }
        
    ]
}

describe('<Pagination />', () => {
    it('displays a loading message', () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(1)}>
            <PaginationComponent page={1} /></MockedProvider>);
        const pagination = wrapper.find('[data-test="pagination"]');
        expect(wrapper.text()).toContain('Loading!');
    });

    it('renders the pagination for 18 items', async () => {

        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <PaginationComponent page={1} /></MockedProvider>);
        const pagination = wrapper.find('[data-test="pagination"]');
        await wait();
        wrapper.update();
        expect(wrapper.find('.totalPages').text()).toEqual('5');
        const paggination = wrapper.find('div[test-pagination="pagination"]');
        expect(toJSON(paggination)).toMatchSnapshot();
    });

    it('disables prev button on first page', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <PaginationComponent page={1} /></MockedProvider>);
        const pagination = wrapper.find('[data-test="pagination"]');
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
    });
    it('disables next button on last page', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(5)}>
            <PaginationComponent page={5} /></MockedProvider>);
        const pagination = wrapper.find('[data-test="pagination"]');
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
    });
    it('enables all buttons on non last page or first pages', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(5)}>
            <PaginationComponent page={2} /></MockedProvider>);
        const pagination = wrapper.find('[data-test="pagination"]');
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
    });
});