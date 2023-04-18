import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import browser from 'webextension-polyfill';

import classnames from 'classnames';
import MetaFoxLogo from '../../ui/metafox-logo';
import {
  DEFAULT_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
} from '../../../helpers/constants/routes';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import ConnectedStatusIndicator from '../connected-status-indicator';


export default class AppHeader extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    networkDropdownOpen: PropTypes.bool,
    showNetworkDropdown: PropTypes.func,
    hideNetworkDropdown: PropTypes.func,
    toggleAccountMenu: PropTypes.func,
    selectedAddress: PropTypes.string,
    isUnlocked: PropTypes.bool,
    hideNetworkIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    disableNetworkIndicator: PropTypes.bool,
    isAccountMenuOpen: PropTypes.bool,
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

  renderAccountMenu() {
    const {
      isUnlocked,
      toggleAccountMenu,
      selectedAddress,
      disabled,
      isAccountMenuOpen,
    } = this.props;

    return (
      isUnlocked && (
        <div
          className={classnames('account-menu__icon', {
            'account-menu__icon--disabled': disabled,
          })}
          onClick={() => {
            if (!disabled) {
              !isAccountMenuOpen &&
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Navigation',
                    action: 'Home',
                    name: 'Opened Main Menu',
                  },
                });
              toggleAccountMenu();
            }
          }}
        >
          {/* <Identicon address={selectedAddress} diameter={32} addBorder />
           */}
          <i className="fas fa-cog" />
        </div>
      )
    );
  }
  showStatus =
    getEnvironmentType() === ENVIRONMENT_TYPE_POPUP &&
    origin &&
    origin !== browser.runtime.id;

  render() {
    const {
      history,
      isUnlocked,
      hideNetworkIndicator,
      disableNetworkIndicator,
      disabled,
      onClick,
    } = this.props;

    return (
      <div
        className={classnames('app-header', {
          'app-header--back-drop': isUnlocked,
        })}
      >
        <div className="app-header__contents">
          <MetaFoxLogo
            unsetIconHeight
            onClick={async () => {
              if (onClick) {
                await onClick();
              }
              history.push(DEFAULT_ROUTE);
            }}
          />
          {this.showStatus ? (
            <ConnectedStatusIndicator
              onClick={() => history.push(CONNECTED_ACCOUNTS_ROUTE)}
            />
          ) : null}

          {/* {!hideNetworkIndicator && (
            <div className="app-header__network-component-wrapper">
              <NetworkDisplay
                colored={false}
                outline
                iconClassName="app-header__network-down-arrow"
                onClick={(event) => this.handleNetworkIndicatorClick(event)}
                disabled={disabled || disableNetworkIndicator}
              />
            </div>
          )} */}
          {this.renderAccountMenu()}
          {/* <AccountOptions /> */}
        </div>
      </div>
    );
  }
}
