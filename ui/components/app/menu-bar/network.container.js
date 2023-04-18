import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import * as actions from '../../../store/actions';
import Network from './network.component';

const mapStateToProps = (state) => {
  const { appState, metamask } = state;
  const { networkDropdownOpen } = appState;
  const { selectedAddress, isUnlocked, isAccountMenuOpen } = metamask;

  return {
    networkDropdownOpen,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Network);
