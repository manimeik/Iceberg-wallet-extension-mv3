import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setWhiteList } from '../../../store/actions';
import { getWhiteList } from '../../../selectors';
import WhiteListTab from './white-list-tab.component';

const mapStateToProps = (state) => {
  return {
    whiteList: getWhiteList(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWhiteList: (val) => dispatch(setWhiteList(val)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(WhiteListTab);
