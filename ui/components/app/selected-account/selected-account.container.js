import { connect } from 'react-redux';
import { getSelectedIdentity ,
  getNativeCurrencyImage,

} from '../../../selectors';
import SelectedAccount from './selected-account.component';

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
    primaryTokenImage: getNativeCurrencyImage(state),

  };
};

export default connect(mapStateToProps)(SelectedAccount);
