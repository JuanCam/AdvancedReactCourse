import React from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $image: String
        $largeImage: String
        $price: Int!
    ) {
    createItem(
        title: $title
        description: $description
        image: $image
        largeImage: $largeImage
        price: $price
    ) {
        id
    }
}
`;

class CreateItem extends React.Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0,
    };

    handleChange = ({target}) => {
        const {name, type, value} = target;
        const val = (type === 'number')
        ? parseFloat(value) : value;
        this.setState({[name]: val});
    }

    uploadFile = async ({target}) => {
        const files = target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/ddxx7sbgs/image/upload', 
        {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage:  file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
             {(createItem, {loading, error, called, data}) => (
                    <Form onSubmit={async (e) => {
                        // Stop the form from submiting
                        e.preventDefault();
                        // Call mutation
                        const res = await createItem();
                        // Go to the single item page
                        Router.push({
                            pathname: '/item',
                            query: {id: res.data.createItem.id}
                        })

                    }}>
                    <Error error={error} />
                    
                    <fieldset disabled={loading} aria-bussy={loading}>

                        <label htmlFor="file">Image File</label>
                        <input type="file"
                            id="file"
                            name="file"
                            placeholder="Upload file"
                            required
                            onChange={this.uploadFile} />
                        {this.state.image && <img src={this.state.image} width="150" alt="Upload preview"></img>}

                        <label htmlFor="title">Title</label>
                        <input type="text" 
                        id="title"
                        name="title"
                        placeholder="Title" 
                        required 
                        value={this.state.title}
                        onChange={this.handleChange}/>

                        <label htmlFor="price">Price</label>
                        <input type="number"
                            id="price"
                            name="price"
                            placeholder="Price"
                            required
                            value={this.state.price}
                            onChange={this.handleChange} />

                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter a description"
                            required
                            value={this.state.description}
                            onChange={this.handleChange} />
                        <button type="submit">Submit</button>
                    </fieldset>
                    </Form>
                )}
            </Mutation>)
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };