import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
query {
    users {
        id
        name
        email
        permissions
    }
}
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
        id
        permissions
        email
        name
    }
}
`;

const permissionsComponent = props => (
    <Query query={ALL_USERS_QUERY} >
        {({ data , loading, error }) => {
            console.log(data);
            return <div>
                <Error error={error} />
                <h2>Manage Permissions</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                            <th>&darr;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map(user => <UserPermissions user={user} key={user.id} />)}
                    </tbody>
                </Table>
            </div>
        }}
    </Query>
);

class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired,
    };
    state = {
        permissions: this.props.user.permissions
    }

    handlePermissionChange = (e) => {
        const checkbox = e.target;
        // take a copy of the current permissions
        let updatePermissions = [...this.state.permissions];
        updatePermissions[0] = e.target.value
        this.setState({ permissions: updatePermissions });
    };


    render() {
        const user = this.props.user;
        return (
            <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{...this.state, userId: this.props.user.id}}>
            {(updatePermissions, {loading, error}) => {
                {error && <Error error={error} />}
                return <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {possiblePermissions.map(permission => <td key={permission}>
                        <label htmlFor={`${user.id}-permission-${permission}`}>
                        <input type="radio"
                            id={`${user.id}-permission-${permission}`}
                            checked={this.state.permissions.includes(permission)}
                            value={permission}
                            name={`${user.email}-field`}
                            onChange={this.handlePermissionChange}/>
                        </label>
                    </td>)}
                    <td><SickButton 
                            type="button" 
                            disabled={loading}
                            onClick={updatePermissions}>updat{loading ? 'ing': 'ed'}</SickButton></td>
                </tr>
                }}
            </Mutation>)
    }
}

export default permissionsComponent;