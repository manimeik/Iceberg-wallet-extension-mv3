import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setFeatureFlag,
  setParticipateInMetaMetrics,
  setUsePhishDetect,
  setDrillPassword,
  setDrillPasswordEnableStatus,
  setDrillPasswordStatus,
} from '../../../store/actions';
import SecurityTab from './security-tab.component';
import {
  getDrillPasswordEnableStatus,
  getDrillPasswordStatus,
} from '../../../selectors'

const mapStateToProps = (state) => {
  const {
    appState: { warning },
    metamask,
  } = state;
  const {
    featureFlags: { showIncomingTransactions } = {},
    participateInMetaMetrics,
    usePhishDetect,
  } = metamask;

  return {
    warning,
    showIncomingTransactions,
    participateInMetaMetrics,
    usePhishDetect,
    drillPasswordStatus: getDrillPasswordStatus(state),
    drillPasswordEnableStatus: getDrillPasswordEnableStatus(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setParticipateInMetaMetrics: (val) =>
      dispatch(setParticipateInMetaMetrics(val)),
    setShowIncomingTransactionsFeatureFlag: (shouldShow) =>
      dispatch(setFeatureFlag('showIncomingTransactions', shouldShow)),
    setUsePhishDetect: (val) => dispatch(setUsePhishDetect(val)),
    setDrillPassword: (value) => dispatch(setDrillPassword(value)),
    toggleDrillPasswordStatus: (value) =>
      dispatch(setDrillPasswordStatus(value)),
    toggleDrillPasswordEnableStatus: (value) =>
      dispatch(setDrillPasswordEnableStatus(value)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SecurityTab);
