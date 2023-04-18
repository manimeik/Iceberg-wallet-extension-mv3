import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Fuse from 'fuse.js';
import InputAdornment from '@material-ui/core/InputAdornment';
import classnames from 'classnames';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import SiteIcon from '../../ui/site-icon';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';
import {
  PRIMARY,
  SUPPORT_LINK,
  ///: BEGIN:ONLY_INCLUDE_IN(beta,flask)
  SUPPORT_REQUEST_LINK,
  ///: END:ONLY_INCLUDE_IN
} from '../../../helpers/constants/common';
import {
  SETTINGS_ROUTE,
  NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  CONNECT_HARDWARE_ROUTE,
  DEFAULT_ROUTE,
} from '../../../helpers/constants/routes';
import TextField from '../../ui/text-field';
import SearchIcon from '../../ui/search-icon';
// import IconCheck from '../../ui/icon/icon-check';
// import IconSpeechBubbles from '../../ui/icon/icon-speech-bubbles';
// import IconConnect from '../../ui/icon/icon-connect';
// import IconCog from '../../ui/icon/icon-cog';
// import IconPlus from '../../ui/icon/icon-plus';
// import IconImport from '../../ui/icon/icon-import';

import Button from '../../ui/button';
import Popover from '../../ui/popover';
import KeyRingLabel from './keyring-label';

// eslint-disable-next-line react/prop-types
const AccountIcon = ({ index }) => {
  return <div className={`account-icon account-type-${index % 5}`}></div>;
};

export function AccountMenuItem(props) {
  const { icon, children, text, subText, className, onClick } = props;

  const itemClassName = classnames('account-menu__item', className, {
    'account-menu__item--clickable': Boolean(onClick),
  });
  return children ? (
    <div className={itemClassName} onClick={onClick}>
      {children}
    </div>
  ) : (
    <div className={itemClassName} onClick={onClick}>
      {icon ? <div className="account-menu__item__icon">{icon}</div> : null}
      {text ? <div className="account-menu__item__text">{text}</div> : null}
      {subText ? (
        <div className="account-menu__item__subtext">{subText}</div>
      ) : null}
    </div>
  );
}

AccountMenuItem.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  text: PropTypes.node,
  subText: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default class AccountMenu extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    shouldShowAccountsSearch: PropTypes.bool,
    accounts: PropTypes.array,
    history: PropTypes.object,
    isAccountMenuOpen: PropTypes.bool,
    keyrings: PropTypes.array,
    lockMetamask: PropTypes.func,
    selectedAddress: PropTypes.string,
    showAccountDetail: PropTypes.func,
    toggleAccountMenu: PropTypes.func,
    addressConnectedSubjectMap: PropTypes.object,
    originOfCurrentTab: PropTypes.string,
    drillPassword: PropTypes.string,
    drillPasswordStatus: PropTypes.bool,
    drillPasswordEnableStatus: PropTypes.bool,
    setDrillPasswordLockStart: PropTypes.func,
  };

  accountsRef;

  state = {
    shouldShowScrollButton: false,
    searchQuery: '',
    showDrillPasswordLockModal: false,
    password: '',
    passwordError: '',
  };

  addressFuse = new Fuse([], {
    threshold: 0.45,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'address', weight: 0.5 },
    ],
  });

  componentDidUpdate(prevProps, prevState) {
    const { isAccountMenuOpen: prevIsAccountMenuOpen } = prevProps;
    const { searchQuery: prevSearchQuery } = prevState;
    const { isAccountMenuOpen } = this.props;
    const { searchQuery } = this.state;

    if (!prevIsAccountMenuOpen && isAccountMenuOpen) {
      this.setShouldShowScrollButton();
      this.resetSearchQuery();
    }

    // recalculate on each search query change
    // whether we can show scroll down button
    if (isAccountMenuOpen && prevSearchQuery !== searchQuery) {
      this.setShouldShowScrollButton();
    }
  }

  renderAccountsSearch() {
    const inputAdornment = (
      <InputAdornment
        position="start"
        style={{
          maxHeight: 'none',
          marginRight: 0,
          marginLeft: '8px',
        }}
      >
        <SearchIcon color="currentColor" />
      </InputAdornment>
    );

    return [
      <TextField
        key="search-text-field"
        id="search-accounts"
        placeholder={this.context.t('searchAccounts')}
        type="text"
        value={this.state.searchQuery}
        onChange={(e) => this.setSearchQuery(e.target.value)}
        startAdornment={inputAdornment}
        fullWidth
        theme="material-white-padded"
      />,
      <div className="account-menu__divider" key="search-divider" />,
    ];
  }

  renderAccounts() {
    const {
      accounts,
      selectedAddress,
      keyrings,
      showAccountDetail,
      addressConnectedSubjectMap,
      originOfCurrentTab,
    } = this.props;
    const { searchQuery } = this.state;

    let filteredIdentities = accounts;
    if (searchQuery) {
      this.addressFuse.setCollection(accounts);
      filteredIdentities = this.addressFuse.search(searchQuery);
    }

    if (filteredIdentities.length === 0) {
      return (
        <p className="account-menu__no-accounts">
          {this.context.t('noAccountsFound')}
        </p>
      );
    }

    return filteredIdentities.map((identity, index) => {
      const isSelected = identity.address === selectedAddress;

      const simpleAddress = identity.address.substring(2).toLowerCase();

      const keyring = keyrings.find((kr) => {
        return (
          kr.accounts.includes(simpleAddress) ||
          kr.accounts.includes(identity.address)
        );
      });
      const addressSubjects =
        addressConnectedSubjectMap[identity.address] || {};
      const iconAndNameForOpenSubject = addressSubjects[originOfCurrentTab];

      return (
        <div
          className="account-menu__account account-menu__item--clickable"
          onClick={() => {
            this.context.metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Switched Account',
              },
            });
            showAccountDetail(identity.address);
          }}
          key={identity.address}
        >
          <div className="account-menu__check-mark">
            {isSelected ? (
              <div className="account-menu__check-mark-icon" />
            ) : null}
          </div>
          <AccountIcon diameter={24} index={index} />

          <div className="account-menu__account-info">
            <div className="account-menu__name">{identity.name || ''}</div>
            <UserPreferencedCurrencyDisplay
              className="account-menu__balance"
              value={identity.balance}
              type={PRIMARY}
            />
          </div>
          <KeyRingLabel keyring={keyring} />
          {iconAndNameForOpenSubject ? (
            <div className="account-menu__icon-list">
              <SiteIcon
                icon={iconAndNameForOpenSubject.icon}
                name={iconAndNameForOpenSubject.name}
                size={32}
              />
            </div>
          ) : null}
        </div>
      );
    });
  }

  resetSearchQuery() {
    this.setSearchQuery('');
  }

  setSearchQuery(searchQuery) {
    this.setState({ searchQuery });
  }

  setShouldShowScrollButton = () => {
    if (!this.accountsRef) {
      return;
    }

    const { scrollTop, offsetHeight, scrollHeight } = this.accountsRef;
    const canScroll = scrollHeight > offsetHeight;
    const atAccountListBottom = scrollTop + offsetHeight >= scrollHeight;
    const shouldShowScrollButton = canScroll && !atAccountListBottom;

    this.setState({ shouldShowScrollButton });
  };

  onScroll = debounce(this.setShouldShowScrollButton, 25);

  handleScrollDown = (e) => {
    e.stopPropagation();

    const { scrollHeight } = this.accountsRef;
    this.accountsRef.scroll({ left: 0, top: scrollHeight, behavior: 'smooth' });

    this.setShouldShowScrollButton();
  };

  renderScrollButton() {
    if (!this.state.shouldShowScrollButton) {
      return null;
    }

    return (
      <div
        className="account-menu__scroll-button"
        onClick={this.handleScrollDown}
      >
        <img
          src="./images/icons/down-arrow.svg"
          width="28"
          height="28"
          alt={this.context.t('scrollDown')}
        />
      </div>
    );
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { t } = this.context;
    const {
      drillPassword,
      setDrillPasswordLockStart,
      lockMetamask,
      history,
    } = this.props;
    const { password } = this.state;
    // eslint-disable-next-line no-negated-condition
    if (drillPassword !== password) {
      this.setState({ passwordError: t('wrongPassword') });
    } else {

      // eslint-disable-next-line no-undef
      fetch('http://worldclockapi.com/api/json/est/now')
        .then((res) => res.json())
        .then((res) => {
          setDrillPasswordLockStart(new Date(res.currentDateTime).getTime());
          lockMetamask();
          history.push(DEFAULT_ROUTE);
        })
        .catch((error) => console.log(error));
    }
  };

  renderDrillPasswordLockModal() {
    const { t } = this.context;
    const { password, passwordError } = this.state;
    return (
      <Popover
        title={t('inputDrillPassword')}
        onClose={() => this.setState({ showDrillPasswordLockModal: false })}
        contentClassName="drill-password-popover__content"
        className="drill-password-popover"
      >
        <form
          className="drill-password-popover__content__form"
          onSubmit={this.handleSubmit}
        >
          <input
            type="password"
            placeholder={t('password')}
            value={password}
            autoFocus
            onChange={(ev) =>
              this.setState({ password: ev.target.value, passwordError: '' })
            }
            className="drill-password-popover__content__form__input"
          />
          <div className="drill-password-popover__content__form__error">
            {passwordError}
          </div>
          <button
            type="submit"
            className="drill-password-popover__content__form__button"
          >
            {t('confirm')}
          </button>
        </form>
      </Popover>
    );
  }

  render() {
    const { t, metricsEvent } = this.context;
    const {
      shouldShowAccountsSearch,
      isAccountMenuOpen,
      toggleAccountMenu,
      lockMetamask,
      history,
      drillPasswordStatus,
      drillPasswordEnableStatus,
    } = this.props;

    const { showDrillPasswordLockModal } = this.state;

    if (!isAccountMenuOpen) {
      return null;
    }

    let supportText = t('support');
    let supportLink = SUPPORT_LINK;
    ///: BEGIN:ONLY_INCLUDE_IN(beta,flask)
    supportText = t('needHelpSubmitTicket');
    supportLink = SUPPORT_REQUEST_LINK;
    ///: END:ONLY_INCLUDE_IN

    return (
      <div className="account-menu">
        <div className="account-menu__close-area" onClick={toggleAccountMenu} />
        <AccountMenuItem className="account-menu__header">
          {/* {t('myAccounts')} */}
          {drillPasswordStatus && drillPasswordEnableStatus && (
            <Button
              className="account-menu__lock-button"
              onClick={() => {
                this.setState({ showDrillPasswordLockModal: true });
              }}
            >
              <i className="fas fa-lock"></i> {t('lockWithDrill')}
            </Button>
          )}
          <Button
            className="account-menu__lock-button"
            onClick={() => {
              lockMetamask();
              history.push(DEFAULT_ROUTE);
            }}
          >
            <i className="fas fa-lock"></i> {t('lockWallet')}
          </Button>
        </AccountMenuItem>
        <div className="account-menu__divider" />
        <div className="account-menu__accounts-container">
          {shouldShowAccountsSearch ? this.renderAccountsSearch() : null}
          <div
            className="account-menu__accounts"
            onScroll={this.onScroll}
            ref={(ref) => {
              this.accountsRef = ref;
            }}
          >
            {this.renderAccounts()}
          </div>
          {this.renderScrollButton()}
        </div>
        <div className="account-menu__divider" />
        <AccountMenuItem
          onClick={() => {
            toggleAccountMenu();
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Clicked Create Account',
              },
            });
            history.push(NEW_ACCOUNT_ROUTE);
          }}
          icon={
            <img
              className="account-menu__item-icon"
              src="images/plus-btn-white.svg"
              alt={t('createAccount')}
            />
          }
          text={t('createAccount')}
        />
        <AccountMenuItem
          onClick={() => {
            toggleAccountMenu();
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Clicked Import Account',
              },
            });
            history.push(IMPORT_ACCOUNT_ROUTE);
          }}
          text={t('importAccount')}
        />
        <AccountMenuItem
          onClick={() => {
            toggleAccountMenu();
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Clicked Connect Hardware',
              },
            });
            if (getEnvironmentType() === ENVIRONMENT_TYPE_POPUP) {
              global.platform.openExtensionInBrowser(CONNECT_HARDWARE_ROUTE);
            } else {
              history.push(CONNECT_HARDWARE_ROUTE);
            }
          }}
          text={t('connectHardwareWallet')}
        />
        <AccountMenuItem
          onClick={() => {
            global.platform.openTab({ url: supportLink });
          }}
          text={supportText}
        />

        <AccountMenuItem
          onClick={() => {
            toggleAccountMenu();
            history.push(SETTINGS_ROUTE);
            this.context.metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Opened Settings',
              },
            });
          }}
          text={t('settings')}
        />
        {showDrillPasswordLockModal && this.renderDrillPasswordLockModal()}
      </div>
    );
  }
}
