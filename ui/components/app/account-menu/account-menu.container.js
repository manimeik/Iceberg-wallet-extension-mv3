import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  toggleAccountMenu,
  showAccountDetail,
  lockMetamask,
  hideWarning,
  setDrillPasswordLockStartTime,
} from '../../../store/actions';
import {
  getAddressConnectedSubjectMap,
  getMetaMaskAccountsOrdered,
  getMetaMaskKeyrings,
  getOriginOfCurrentTab,
  getSelectedAddress,
  getDrillPassword,
  getDrillPasswordEnableStatus,
  getDrillPasswordStatus,
} from '../../../selectors';
import AccountMenu from './account-menu.component';

/**
 * The min amount of accounts to show search field
 */
const SHOW_SEARCH_ACCOUNTS_MIN_COUNT = 5;

function mapStateToProps(state) {
  const {
    metamask: { isAccountMenuOpen },
  } = state;
  const accounts = getMetaMaskAccountsOrdered(state);
  const origin = getOriginOfCurrentTab(state);
  const selectedAddress = getSelectedAddress(state);

  return {
    isAccountMenuOpen,
    addressConnectedSubjectMap: getAddressConnectedSubjectMap(state),
    originOfCurrentTab: origin,
    selectedAddress,
    keyrings: getMetaMaskKeyrings(state),
    accounts,
    shouldShowAccountsSearch: accounts.length >= SHOW_SEARCH_ACCOUNTS_MIN_COUNT,
    drillPassword: getDrillPassword(state),
    drillPasswordEnableStatus: getDrillPasswordEnableStatus(state),
    drillPasswordStatus: getDrillPasswordStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAccountMenu: () => dispatch(toggleAccountMenu()),
    showAccountDetail: (address) => {
      dispatch(showAccountDetail(address));
      dispatch(toggleAccountMenu());
    },
    lockMetamask: () => {
      dispatch(lockMetamask());
      dispatch(hideWarning());
      dispatch(toggleAccountMenu());
    },
    setDrillPasswordLockStart: (value) =>
    dispatch(setDrillPasswordLockStartTime(value)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AccountMenu);
