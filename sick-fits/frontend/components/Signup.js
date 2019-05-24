import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
 mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
     signup(email: $email, password: $password, name: $name) {
         id
         email
         name
     }
 }
`;


class Signup extends React.Component {
    state = {
        email: '',
        name: '',
        password: '',
    };

    saveToState = ({target}) => {
        const {name, value} = target;
        this.setState({[name]: value})
    };

    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={{ ...this.state }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                {(signup, {error, loading}) => {
                    return (<Form method='post' onSubmit={async (e) => {
                        e.preventDefault()
                        await signup();
                        this.setState({
                            email: '',
                            name: '',
                            password: '',
                        });
                        
                        }}>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Sign up for an account</h2>
                        <Error error={error} />
                        <label htmlFor="email" ></label>
                        Email
                        <input id="email" name="email" type="email" placeholder="Your Email please" value={this.state.email} onChange={this.saveToState} />
                        <label htmlFor="name" ></label>
                        Name
                        <input id="name" name="name" type="text" placeholder="Your Name please" value={this.state.name} onChange={this.saveToState} />
                        <label htmlFor="password" ></label>
                        Password
                        <input id="password" name="password" type="password" placeholder="Your Password please" value={this.state.password} onChange={this.saveToState} />
                        <button type="submit">Sign up</button>
                    </fieldset>
                </Form>)
            }}
                
            </Mutation>);
    }
}

export default Signup;
export { SIGNUP_MUTATION };