import UpdateItem from '../components/UpdateItem';

const update = props => (
    <div>
        <UpdateItem id={props.query.id}></UpdateItem>
    </div>);

export default update;