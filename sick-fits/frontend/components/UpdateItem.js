import React from 'react';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const UPDATE_ITEM_MUTATION = gql`
mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
    updateItem(
        id: $id
        title: $title
        description: $description
        price: $price
    ) {
        id
    }
}
`;

const SINGLE_ITEM_QUERY = gql`
query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
        id
        title
        description
        price
    }
}
`;

class UpdateItem extends React.Component {
    state = {};

    handleChange = ({target}) => {
        const {name, type, value} = target;
        const val = (type === 'number')
        ? parseFloat(value) : value;
        this.setState({[name]: val});
    }

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state,
            }
        });

    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ data, loading }) => {
                    if(loading) return <p>Loading...</p>;
                    if(!data.item) return <p>No item found!</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, {loading, error}) => (
                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                <Error error={error} />
                                
                                <fieldset disabled={loading} aria-busy={loading}>
                                    <label htmlFor="title">Title</label>
                                    <input type="text" 
                                    id="title"
                                    name="title"
                                    placeholder="Title" 
                                    required 
                                    defaultValue={data.item.title}
                                    onChange={this.handleChange}/>

                                    <label htmlFor="price">Price</label>
                                    <input type="number"
                                        id="price"
                                        name="price"
                                        placeholder="Price"
                                        required
                                        defaultValue={data.item.price}
                                        onChange={this.handleChange} />

                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter a description"
                                        required
                                        defaultValue={data.item.description}
                                        onChange={this.handleChange} />
                                    <button type="submit">Save changes</button>
                                </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    );
                }}
            </Query>)
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };