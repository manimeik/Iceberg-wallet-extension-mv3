import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../../../components/ui/button';
import PermissionsConnectHeader from '../../../components/app/permissions-connect-header';

export default class NotWhiteListed extends Component {
  static propTypes = {
    cancelPermissionsRequest: PropTypes.func.isRequired,
    permissionsRequestId: PropTypes.string.isRequired,
    targetDomainMetadata: PropTypes.shape({
      extensionId: PropTypes.string,
      icon: PropTypes.string,
      host: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
    }),
    handleConfirm: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    termsChecked: false,
  };

  toggleChecked = () => {
    this.setState((prevState) => ({
      termsChecked: !prevState.termsChecked,
    }));
  };

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleChecked();
    }
  };

  render() {
    const {
      permissionsRequestId,
      cancelPermissionsRequest,
      targetDomainMetadata,
      handleConfirm,
    } = this.props;
    const { termsChecked } = this.state;
    console.log(targetDomainMetadata);
    const { t } = this.context;
    return (
      <div className="not-white-listed">
        <PermissionsConnectHeader
          icon={targetDomainMetadata.icon}
          iconName={targetDomainMetadata.name}
          headerTitle={t('connectWithMetaMask')}
          headerText={t('notWhiteListed')}
          siteOrigin={targetDomainMetadata.origin}
        />
        <div className="not-white-listed__check" onClick={this.toggleChecked}>
          <div
            className="not-white-listed__check__checkbox"
            tabIndex="0"
            role="checkbox"
            onKeyPress={this.onTermsKeyPress}
            aria-checked={termsChecked}
            aria-labelledby="ftf-chk1-label"
          >
            {termsChecked ? <i className="fa fa-check" /> : null}
          </div>
          <div className="not-white-listed__check__description">
            {t('wantAddThisDomainToWhiteList')}
          </div>
        </div>
        <div className="permissions-connect-choose-account__footer-container">
          <div className="permissions-connect-choose-account__bottom-buttons">
            <Button
              onClick={() => cancelPermissionsRequest(permissionsRequestId)}
              type="secondary"
              rounded={false}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={() => {
                handleConfirm();
              }}
              type="primary"
              rounded={false}
              disabled={!termsChecked}
            >
              {t('confirm')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
