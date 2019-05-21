// import TakeMyMoney from '../components/TakeMyMoney';
import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const order = props => (
    <div>
        <PleaseSignIn>
            {/* <TakeMyMoney /> */}
            <Order id={props.query.id} />
        </PleaseSignIn>
    </div>);

export default order;