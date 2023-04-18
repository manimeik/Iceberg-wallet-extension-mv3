import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from '../../../../components/ui/box';
import LockIcon from '../../../../components/ui/lock-icon';
import Button from '../../../../components/ui/button';
import Snackbar from '../../../../components/ui/snackbar';
import {
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
} from '../../../../helpers/constants/routes';
import { exportAsFile } from '../../../../helpers/utils/util';
import { returnToOnboardingInitiator } from '../../onboarding-initiator-util';

export default class RevealSeedPhrase extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object,
    seedPhrase: PropTypes.string,
    setSeedPhraseBackedUp: PropTypes.func,
    setCompletedOnboarding: PropTypes.func,
    onboardingInitiator: PropTypes.exact({
      location: PropTypes.string,
      tabId: PropTypes.number,
    }),
  };

  state = {
    isShowingSeedPhrase: false,
  };

  handleExport = () => {
    exportAsFile('', this.props.seedPhrase, 'text/plain');
  };

  handleNext = () => {
    const { isShowingSeedPhrase } = this.state;
    const { history } = this.props;

    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Seed Phrase Setup',
        name: 'Advance to Verify',
      },
    });

    if (!isShowingSeedPhrase) {
      return;
    }

    history.replace(INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE);
  };

  handleSkip = async () => {
    const {
      history,
      setSeedPhraseBackedUp,
      setCompletedOnboarding,
      onboardingInitiator,
    } = this.props;

    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Seed Phrase Setup',
        name: 'Remind me later',
      },
    });

    await Promise.all([setCompletedOnboarding(), setSeedPhraseBackedUp(false)]);

    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator);
    }
    history.replace(DEFAULT_ROUTE);
  };

  renderSecretWordsContainer() {
    const { t } = this.context;
    const { seedPhrase } = this.props;
    const { isShowingSeedPhrase } = this.state;

    return (
      <div className="reveal-seed-phrase__secret">
        <div
          className={classnames(
            'reveal-seed-phrase__secret-words notranslate',
            {
              'reveal-seed-phrase__secret-words--hidden': !isShowingSeedPhrase,
            },
          )}
        >
          {seedPhrase}
        </div>
        {!isShowingSeedPhrase && (
          <div
            className="reveal-seed-phrase__secret-blocker"
            onClick={() => {
              this.context.metricsEvent({
                eventOpts: {
                  category: 'Onboarding',
                  action: 'Seed Phrase Setup',
                  name: 'Revealed Words',
                },
              });
              this.setState({ isShowingSeedPhrase: true });
            }}
          >
            <LockIcon width="28px" height="35px" fill="#FFFFFF" />
            <div className="reveal-seed-phrase__reveal-button">
              {t('clickToRevealSeed')}
            </div>
          </div>
        )}
      </div>
    );
  }

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };

  toggleTermsCheck = () => {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Reveal Seed Phrase',
        name: 'Check ToS',
      },
    });
    this.setState((prevState) => ({
      termsChecked: !prevState.termsChecked,
    }));
  };

  render() {
    const { t } = this.context;
    const { isShowingSeedPhrase, termsChecked } = this.state;
    const { history, onboardingInitiator, seedPhrase } = this.props;

    return (
      <div className="reveal-seed-phrase">
        <div className="reveal-seed-phrase__sections">
          <div className="reveal-seed-phrase__main">
            <Box marginBottom={4}>
              <a
                href="#"
                className="reveal-seed-phrase__go-back"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
                }}
              >
                {`< ${t('back')}`}
              </a>
            </Box>
            <div className="reveal-seed-phrase__header">
              {t('backUpWallet')}
            </div>
            <div className="reveal-seed-phrase__text-block">
              {t('secretBackupPhraseDescription')}
            </div>
            {this.renderSecretWordsContainer()}
          </div>
          <div
            className="reveal-seed-phrase__copy"
            onClick={() => navigator.clipboard.writeText(seedPhrase)}
          >
            <img src="/images/icons/copy.svg" />
            {t('copyToClipBoard')}
          </div>
          <div
            className="reveal-seed-phrase__checkbox-container"
            onClick={this.toggleTermsCheck}
          >
            <div>
              <div
                className="reveal-seed-phrase__checkbox"
                tabIndex="0"
                role="checkbox"
                onKeyPress={this.onTermsKeyPress}
                aria-checked={termsChecked}
                aria-labelledby="ftf-chk3-label"
              >
                {termsChecked ? <i className="fa fa-check fa-2x" /> : null}
              </div>
            </div>
            <span
              id="ftf-chk3-label"
              className="reveal-seed-phrase__checkbox-label"
            >
              {t('understandRecoveryPhrase')}
            </span>
          </div>
        </div>
        <div>
          <Button
            className="reveal-seed-phrase__button"
            onClick={this.handleNext}
            disabled={!isShowingSeedPhrase || !termsChecked}
          >
            {t('continue')}
          </Button>
        </div>
        {onboardingInitiator ? (
          <Snackbar
            content={t('onboardingReturnNotice', [
              t('remindMeLater'),
              onboardingInitiator.location,
            ])}
          />
        ) : null}
      </div>
    );
  }
}
