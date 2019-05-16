import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
 mutation REQUEST_RESET_MUTATION($email: String!) {
     requestReset(email: $email) {
         message
     }
 }
`;


class Signin extends React.Component {
    state = {
        email: '',
    };

    saveToState = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value })
    };

    render() {
        return (
            <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ ...this.state }}>
                {(reset, { error, loading, called }) => {
                    return (<Form method='post' onSubmit={async (e) => {
                        e.preventDefault()
                        const success = await reset();
                        this.setState({email: ''});

                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Requested password reset</h2>
                            {/* <Error error={error} /> */}
                            {!error && !loading && called && <p>Success in request!</p>}
                            <label htmlFor="email" ></label>
                            Email
                        <input id="email" name="email" type="email" placeholder="Your Email please" value={this.state.email} onChange={this.saveToState} />
                            <button type="submit">Request reset</button>
                        </fieldset>
                    </Form>)
                }}

            </Mutation>);
    }
}

export default Signin;