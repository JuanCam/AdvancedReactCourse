import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const pleaseSignIn = props => (
    <Query query={CURRENT_USER_QUERY} >
        {({data: { me }, loading}) => {
            if (loading) return <p>Loading..</p>;
            if (!me || !me.id) {
                return <div><p>Please Login to continue!</p><Signin /></div>
            }
            return <div>{props.children}</div>
        }}
    </Query>
);

export default pleaseSignIn;