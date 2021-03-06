import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
 query {
        me  {
        id
        email
        name
        permissions
        orders {
            id
        }
        cart {
            id
            quantity
            item {
                id
                price
                title
                description
                image
            }
        }
    }
 }
`;

const user = props => (
    <Query query={CURRENT_USER_QUERY} {...props} >
        {payload => props.children(payload)}
    </Query>
)

user.propTypes = {
    children: PropTypes.func.isRequired
};

export default user;
export { CURRENT_USER_QUERY };