import Items from '../components/Items';

const home = props => (
    <div>
        <Items page={props.query.page || 1} />
    </div>);

export default home;