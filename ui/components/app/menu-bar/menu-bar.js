import React, { useState, useContext } from 'react';
import SelectedAccount from '../selected-account';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics.new';

import AccountOptionsMenu from './account-options-menu';
import Network from './network.container';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import * as actions from '../../../store/actions';

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

compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Network);

export default function MenuBar() {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);

  const [
    accountOptionsButtonElement,
    setAccountOptionsButtonElement,
  ] = useState(null);
  const [accountOptionsMenuOpen, setAccountOptionsMenuOpen] = useState(false);

  return (
    <div className="menu-bar">
         <SelectedAccount />
      <div style={{ display: 'flex' }}>
        <Network />
        <button
          className="fas fa-ellipsis-v menu-bar__account-options"
          data-testid="account-options-menu-button"
          ref={setAccountOptionsButtonElement}
          title={t('accountOptions')}
          onClick={() => {
            trackEvent({
              event: 'Opened Account Options',
              category: 'Navigation',
              properties: {
                action: 'Home',
                legacy_event: true,
              },
            });
            setAccountOptionsMenuOpen(true);
          }}
        />

        {accountOptionsMenuOpen && (
          <AccountOptionsMenu
            anchorElement={accountOptionsButtonElement}
            onClose={() => setAccountOptionsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
