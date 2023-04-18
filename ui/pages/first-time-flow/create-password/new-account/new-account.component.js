import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/ui/button';
import {
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
} from '../../../../helpers/constants/routes';
import TextField from '../../../../components/ui/text-field';

export default class NewAccount extends PureComponent {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: false,
  };

  isValid() {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
    } = this.state;

    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }

  handlePasswordChange(password) {
    const { t } = this.context;

    this.setState((state) => {
      const { confirmPassword } = state;
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      };
    });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const { t } = this.context;

    this.setState((state) => {
      const { password } = state;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        confirmPassword,
        confirmPasswordError,
      };
    });
  }

  handleCreate = async (event) => {
    event.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const { password } = this.state;
    const { onSubmit, history } = this.props;

    try {
      await onSubmit(password);

      this.context.metricsEvent({
        eventOpts: {
          category: 'Onboarding',
          action: 'Create Password',
          name: 'Submit Password',
        },
      });

      history.push(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
    } catch (error) {
      this.setState({ passwordError: error.message });
    }
  };

  toggleTermsCheck = () => {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Create Password',
        name: 'Check ToS',
      },
    });

    this.setState((prevState) => ({
      termsChecked: !prevState.termsChecked,
    }));
  };

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };

  render() {
    const { t } = this.context;
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      termsChecked,
    } = this.state;

    return (
      <div className="first-time-flow__create-password">
        <div className="first-time-flow__create-back">
          <a
            onClick={(e) => {
              e.preventDefault();
              this.context.metricsEvent({
                eventOpts: {
                  category: 'Onboarding',
                  action: 'Create Password',
                  name: 'Go Back from Onboarding Create',
                },
              });
              this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
            }}
            href="#"
          >
            <img src="/images/icons/arrow-left.svg" />
            <span> {`${t('back')}`}</span>
          </a>
        </div>
        <div className="first-time-flow__form-wrap">
          <form className="first-time-flow__form" onSubmit={this.handleCreate}>
            <div className="new-account-header">
              {t('createPassword')}
            </div>
            <label>{t('passwordSetupDetails')}</label>
            <TextField
              id="create-password"
              label={t('newPassword')}
              type="password"
              className="first-time-flow__input"
              value={password}
              onChange={(event) =>
                this.handlePasswordChange(event.target.value)
              }
              error={passwordError}
              autoFocus
              autoComplete="new-password"
              margin="normal"
              fullWidth
              largeLabel
            />
            <TextField
              id="confirm-password"
              label={t('verifyPassword')}
              type="password"
              className="first-time-flow__input"
              value={confirmPassword}
              onChange={(event) =>
                this.handleConfirmPasswordChange(event.target.value)
              }
              error={confirmPasswordError}
              autoComplete="confirm-password"
              margin="normal"
              fullWidth
              largeLabel
            />
            <Button
              className="first-time-flow__create-btn"
              disabled={!this.isValid()}
              onClick={this.handleCreate}
            >
              {t('createWallet')}
            </Button>
            <div>
              <span className="first-time-flow__link-text">
                {t('alreadyHaveWallet')}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.context.metricsEvent({
                      eventOpts: {
                        category: 'Onboarding',
                        action: 'Create Password',
                        name: 'Go Back from Onboarding Create',
                      },
                    });
                    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
                  }}
                  href="#"
                  className="first-time-flow__link-text__link-btn"
                >
                  {t('importWalletSmall')}
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
