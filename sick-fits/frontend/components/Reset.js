import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_MUTATION = gql`
 mutation REQUEST_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
     resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
         id
         email
         name
     }
 }
`;

class Reset extends React.Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    };

    state = {
        password: '',
        confirmPassword: ''
    };

    saveToState = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value })
    };

    render() {
        return (
            <Mutation mutation={REQUEST_MUTATION} variables={{ ...this.state, resetToken: this.props.resetToken }} refetchQueries={[{ query: CURRENT_USER_QUERY }]} >
                {(reset, { error, loading, called }) => {
                    return (<Form method='post' onSubmit={async (e) => {
                        e.preventDefault()
                        const success = await reset();
                        this.setState({ email: '' });

                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset your password</h2>
                            {/* <Error error={error} /> */}
                            {!error && !loading && called && <p>Success in request!</p>}
                            <label htmlFor="password" ></label>
                                Password
                            <input id="password" name="password" type="password" placeholder="Your Email please" value={this.state.password} onChange={this.saveToState} />
                            <label htmlFor="confirmPassword" ></label>
                                Confirm Password
                            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Your Email please" value={this.state.confirmPassword} onChange={this.saveToState} />
                            
                            <button type="submit">Reset password</button>
                        </fieldset>
                    </Form>)
                }}

            </Mutation>);
    }
}

export default Reset;