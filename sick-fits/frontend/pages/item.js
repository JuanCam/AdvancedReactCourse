import SingleItems from '../components/SingleItems';

const item = props => (
    <div>
        <SingleItems id={props.query.id}/>
    </div>);

export default item;