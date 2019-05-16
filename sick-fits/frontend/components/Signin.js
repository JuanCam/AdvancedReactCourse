import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
 mutation SIGNIN_MUTATION($email: String!, $password: String!) {
     signin(email: $email, password: $password) {
         id
         email
         name
     }
 }
`;


class Signin extends React.Component {
    state = {
        email: '',
        password: '',
    };

    saveToState = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value })
    };

    render() {
        return (
            <Mutation mutation={SIGNIN_MUTATION} variables={{ ...this.state }} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                {(signup, { error, loading }) => {
                    return (<Form method='post' onSubmit={async (e) => {
                        e.preventDefault()
                        await signup();
                        this.setState({
                            email: '',
                            password: '',
                        });

                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign up for an account</h2>
                            <Error error={error} />
                            <label htemlFor="email" ></label>
                            Email
                        <input id="email" name="email" type="email" placeholder="Your Email please" value={this.state.email} onChange={this.saveToState} />
                            <label htemlFor="name" ></label>
                            Password
                        <input id="password" name="password" type="password" placeholder="Your Password please" value={this.state.password} onChange={this.saveToState} />
                        <button type="submit">Sign in</button>
                        </fieldset>
                    </Form>)
                }}

            </Mutation>);
    }
}

export default Signin;