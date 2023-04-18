import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '../../../components/ui/toggle-button';
import { REVEAL_SEED_ROUTE } from '../../../helpers/constants/routes';
import Button from '../../../components/ui/button';
import {
  getSettingsSectionNumber,
  handleSettingsRefs,
} from '../../../helpers/utils/settings-search';
import Popover from '../../../components/ui/popover';


export default class SecurityTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
  };

  static propTypes = {
    warning: PropTypes.string,
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool.isRequired,
    setParticipateInMetaMetrics: PropTypes.func.isRequired,
    showIncomingTransactions: PropTypes.bool.isRequired,
    setShowIncomingTransactionsFeatureFlag: PropTypes.func.isRequired,
    setUsePhishDetect: PropTypes.func.isRequired,
    usePhishDetect: PropTypes.bool.isRequired,
    setDrillPassword: PropTypes.func,
    toggleDrillPasswordStatus: PropTypes.func,
    toggleDrillPasswordEnableStatus: PropTypes.func,
    drillPasswordStatus: PropTypes.bool,
    drillPasswordEnableStatus: PropTypes.bool,
  };

  settingsRefs = Array(
    getSettingsSectionNumber(
      this.context.t,
      this.context.t('securityAndPrivacy'),
    ),
  )
    .fill(undefined)
    .map(() => {
      return React.createRef();
    });

  componentDidUpdate() {
    const { t } = this.context;
    handleSettingsRefs(t, t('securityAndPrivacy'), this.settingsRefs);
  }

  componentDidMount() {
    const { t } = this.context;
    handleSettingsRefs(t, t('securityAndPrivacy'), this.settingsRefs);
  }

  renderSeedWords() {
    const { t } = this.context;
    const { history } = this.props;

    return (
      <div ref={this.settingsRefs[0]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('revealSeedWords')}</span>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <Button
              type="danger"
              large
              onClick={(event) => {
                event.preventDefault();
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Settings',
                    action: 'Reveal Seed Phrase',
                    name: 'Reveal Seed Phrase',
                  },
                });
                history.push(REVEAL_SEED_ROUTE);
              }}
            >
              {t('revealSeedWords')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderMetaMetricsOptIn() {
    const { t } = this.context;
    const {
      participateInMetaMetrics,
      setParticipateInMetaMetrics,
    } = this.props;

    return (
      <div ref={this.settingsRefs[3]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('participateInMetaMetrics')}</span>
          <div className="settings-page__content-description">
            <span>{t('participateInMetaMetricsDescription')}</span>
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={participateInMetaMetrics}
              onToggle={(value) => setParticipateInMetaMetrics(!value)}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderIncomingTransactionsOptIn() {
    const { t } = this.context;
    const {
      showIncomingTransactions,
      setShowIncomingTransactionsFeatureFlag,
    } = this.props;

    return (
      <div ref={this.settingsRefs[1]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('showIncomingTransactions')}</span>
          <div className="settings-page__content-description">
            {t('showIncomingTransactionsDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={showIncomingTransactions}
              onToggle={(value) =>
                setShowIncomingTransactionsFeatureFlag(!value)
              }
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderPhishingDetectionToggle() {
    const { t } = this.context;
    const { usePhishDetect, setUsePhishDetect } = this.props;

    return (
      <div ref={this.settingsRefs[2]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('usePhishingDetection')}</span>
          <div className="settings-page__content-description">
            {t('usePhishingDetectionDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={usePhishDetect}
              onToggle={(value) => setUsePhishDetect(!value)}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderDrillPasswordOption() {
    const { t } = this.context;
    const {
      drillPasswordEnableStatus,
      toggleDrillPasswordEnableStatus,
    } = this.props;

    return (
      <div className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('enableDrillPassword')}</span>
          <div className="settings-page__content-description">
            {t('enableDrillPasswordDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={drillPasswordEnableStatus}
              onToggle={(value) => toggleDrillPasswordEnableStatus(!value)}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  handleSubmit = (ev) => {
    const { toggleDrillPasswordStatus, setDrillPassword } = this.props;
    ev.preventDefault();
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ passwordError: 'Password Dismatch' });
      return;
    }
    this.setState({ passwordError: '' });
    setDrillPassword(password);
    toggleDrillPasswordStatus(true);
  };

  renderDrillPasswordModal() {
    const { t } = this.context;
    const { toggleDrillPasswordEnableStatus } = this.props;
    const { password, passwordError, confirmPassword } = this.state;

    return (
      <Popover
        title={t('setDrillPassword')}
        onClose={() => toggleDrillPasswordEnableStatus(false)}
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
            onChange={(ev) =>
              this.setState({ password: ev.target.value, passwordError: '' })
            }
            className="drill-password-popover__content__form__input"
          />
          <input
            type="password"
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={(ev) =>
              this.setState({
                confirmPassword: ev.target.value,
                passwordError: '',
              })
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
            {t('create')}
          </button>
        </form>
      </Popover>
    );
  }

  render() {
    const { warning,   drillPasswordEnableStatus,
      drillPasswordStatus, } = this.props;

    return (
      <div className="settings-page__body">
        {warning ? <div className="settings-tab__error">{warning}</div> : null}
        {this.renderSeedWords()}
        {this.renderIncomingTransactionsOptIn()}
        {this.renderPhishingDetectionToggle()}
        {this.renderMetaMetricsOptIn()}
        {this.renderDrillPasswordOption()}
        {drillPasswordEnableStatus &&
          !drillPasswordStatus &&
          this.renderDrillPasswordModal()}
      </div>
    );
  }
}
