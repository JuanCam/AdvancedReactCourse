import Reset from '../components/Reset';

const reset = props => (
    <Reset resetToken={props.query.resetToken} />
);

export default reset;