import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NetworkDisplay from '../network-display';

export default class Network extends PureComponent {
  static propTypes = {
    networkDropdownOpen: PropTypes.bool,
    showNetworkDropdown: PropTypes.func,
    hideNetworkDropdown: PropTypes.func,
    hideNetworkIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    disableNetworkIndicator: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  handleNetworkIndicatorClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const {
      networkDropdownOpen,
      showNetworkDropdown,
      hideNetworkDropdown,
      disabled,
      disableNetworkIndicator,
    } = this.props;

    if (disabled || disableNetworkIndicator) {
      return;
    }

    if (networkDropdownOpen === false) {
      this.context.metricsEvent({
        eventOpts: {
          category: 'Navigation',
          action: 'Home',
          name: 'Opened Network Menu',
        },
      });
      showNetworkDropdown();
    } else {
      hideNetworkDropdown();
    }
  }

  render() {
    const {
      hideNetworkIndicator,
      disableNetworkIndicator,
      disabled,
    } = this.props;
    return (
      <div>
        {!hideNetworkIndicator && (
          <div className="menu-bar__network-component-wrapper">
            <NetworkDisplay
              colored={false}
              outline
              iconClassName="menu-bar__network-down-arrow"
              onClick={(event) => this.handleNetworkIndicatorClick(event)}
              disabled={disabled || disableNetworkIndicator}
            />
          </div>
        )}
      </div>
    );
  }
}
