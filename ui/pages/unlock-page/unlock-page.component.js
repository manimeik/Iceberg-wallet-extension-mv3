import { EventEmitter } from 'events';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getCaretCoordinates from 'textarea-caret';
// import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../../components/ui/button';
import TextField from '../../components/ui/text-field';
// import Mascot from '../../components/ui/mascot';
// import { SUPPORT_LINK } from '../../helpers/constants/common';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';

export default class UnlockPage extends Component {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  };

  static propTypes = {
    /**
     * History router for redirect after action
     */
    history: PropTypes.object.isRequired,
    /**
     * If isUnlocked is true will redirect to most recent route in history
     */
    isUnlocked: PropTypes.bool,
    /**
     * onClick handler for "Forgot password?" link
     */
    onRestore: PropTypes.func,
    /**
     * onSumbit handler when form is submitted
     */
    onSubmit: PropTypes.func,
    /**
     * Force update metamask data state
     */
    forceUpdateMetamaskState: PropTypes.func,
    /**
     * Event handler to show metametrics modal
     */
    showOptInModal: PropTypes.func,
    shouldShowRecaptcha: PropTypes.bool,
    drillPasswordLockStartTime: PropTypes.string,
    drillPasswordEnableStatus: PropTypes.bool,
  };

  state = {
    password: '',
    error: null,
    verifyStatus: true,
    recaptchaErrorShow: false,
    drillError: null,
  };

  submitting = false;

  animationEventEmitter = new EventEmitter();

  UNSAFE_componentWillMount() {
    const {
      isUnlocked,
      history,
      drillPasswordLockStartTime,
      drillPasswordEnableStatus,
    } = this.props;

    const { t } = this.context;


    if (drillPasswordEnableStatus) {
      fetch('http://worldclockapi.com/api/json/est/now')
        .then((res) => res.json())
        .then((res) => {
          // 172800000 : 48hr
          if (
            new Date(res.currentDateTime).getTime() -
              drillPasswordLockStartTime -
              172800000 <=
            0
          ) {
            this.setState({ drillError: t('drillPasswordTimeError') });
          } else this.setState({ drillError: null });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { password, verifyStatus, drillError } = this.state;

    const {
      onSubmit,
      forceUpdateMetamaskState,
      showOptInModal,
      shouldShowRecaptcha,
    } = this.props;

    if (drillError) return;
    if (shouldShowRecaptcha && !verifyStatus) {
      this.setState({ recaptchaErrorShow: true });
      return;
    }

    if (password === '' || this.submitting) {
      return;
    }

    this.setState({ error: null });
    this.submitting = true;

    try {
      await onSubmit(password);
      const newState = await forceUpdateMetamaskState();
      this.context.metricsEvent({
        eventOpts: {
          category: 'Navigation',
          action: 'Unlock',
          name: 'Success',
        },
        isNewVisit: true,
      });

      if (
        newState.participateInMetaMetrics === null ||
        newState.participateInMetaMetrics === undefined
      ) {
        showOptInModal();
      }
    } catch ({ message }) {
      if (message === 'Incorrect password') {
        const newState = await forceUpdateMetamaskState();
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Unlock',
            name: 'Incorrect Password',
          },
          customVariables: {
            numberOfTokens: newState.tokens.length,
            numberOfAccounts: Object.keys(newState.accounts).length,
          },
        });
      }

      this.setState({ error: message });
      this.submitting = false;
    }
  };

  handleInputChange({ target }) {
    this.setState({ password: target.value, error: null });

    // tell mascot to look at page action
    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = getCaretCoordinates(element, element.selectionEnd);
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      });
    }
  }

  // onChange = (token) => {
  //   this.setState({ verifyStatus: true, recaptchaErrorShow: false });
  // };

  renderSubmitButton() {
    const style = {
      backgroundColor: '#7CD8FF',
      color: 'white',
      marginTop: '20px',
      height: '40px',
      fontWeight: '400',
      boxShadow: 'none',
      borderRadius: '5px',
      marginBottom: '50px',
    };
    return (
      <Button
        type="submit"
        style={style}
        disabled={!this.state.password}
        variant="contained"
        size="large"
        onClick={this.handleSubmit}
      >
        {this.context.t('unlock')}
      </Button>
    );
  }

  render() {
    const { password, error, recaptchaErrorShow, drillError } = this.state;

    const { t } = this.context;
    const { onRestore, shouldShowRecaptcha } = this.props;

    return (
      <div className="unlock-page__container">
        <div className="unlock-page">
          <div className="unlock-page__buttons">
            <button
              className="unlock-page__buttons__new-wallet"
              style={{ visibility: 'hidden' }}
            >
              {t('newWallet')}
            </button>
            {/* <div className="unlock-page__links"> */}
            {/* {t('importAccountText', [ */}
            <button
              key="import-account"
              className="unlock-page__buttons__reset-wallet"
              onClick={() => onRestore()}
            >
              {t('resetWallet')}
            </button>
            {/* ])} */}
            {/* </div> */}
          </div>
          <div className="unlock-page__mascot-container">
            <img height="80" width="80" src="/images/icon-128.png" alt="" />
          </div>
          <h1 className="unlock-page__title">{t('iceBerg')}</h1>
          {/* <div>{t('unlockMessage')}</div> */}
          <form className="unlock-page__form" onSubmit={this.handleSubmit}>
            <TextField
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => this.handleInputChange(event)}
              error={error}
              autoFocus
              autoComplete="current-password"
              // theme="material"
              fullWidth
            />
          </form>
          <div className="unlock-page__drillError">{drillError}</div>

          {this.renderSubmitButton()}
          {shouldShowRecaptcha && (
            <div>
              {recaptchaErrorShow && (
                <div className="unlock-page__recaptcha-error">
                  {t('recaptchaError')}
                </div>
              )}
              {/* <ReCAPTCHA
                sitekey="6Le5-HEeAAAAAAEOG9SlYdu6PZ2eqe9uemmDSLFe"
                onChange={this.onChange}
              /> */}
            </div>
          )}
          {/* <div className="unlock-page__links">
            <Button
              type="link"
              key="import-account"
              className="unlock-page__link"
              onClick={() => onRestore()}
            >
              {t('forgotPassword')}
            </Button>
          </div>
          <div className="unlock-page__support">
            {t('needHelp', [
              <a
                href={SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                key="need-help-link"
              >
                {t('needHelpLinkText')}
              </a>,
            ])}
          </div> */}
        </div>
      </div>
    );
  }
}
