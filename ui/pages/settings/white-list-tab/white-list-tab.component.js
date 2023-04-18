import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class WhiteListTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    whiteList: PropTypes.object,
    setWhiteList: PropTypes.func,
  };

  state = {
    domainInput: '',
  };

  handleAdd = () => {
    const { domainInput } = this.state;
    const { setWhiteList, whiteList } = this.props;
    if (whiteList.includes(domainInput)) return;
    setWhiteList([...whiteList, domainInput]);
    this.setState({ domainInput: '' });
  };

  handleRemove = (domain) => {
    const { setWhiteList, whiteList } = this.props;
    setWhiteList(whiteList.filter((item) => item !== domain));
  };

  render() {
    const { t } = this.context;
    const { whiteList } = this.props;
    const { domainInput } = this.state;
    return (
      <div className="settings-page__body">
        <div className="settings-page__content-row">
          <div className="settings-page__white-list-input">
            <input
              placeholder={t('domainWantAdd')}
              value={domainInput}
              onChange={(ev) => this.setState({ domainInput: ev.target.value })}
            />
            <button onClick={this.handleAdd}>{t('add')}</button>
          </div>
          <div className="settings-page__white-list-items">
            {whiteList.length !==0 && whiteList?.map((item, index) => (
              <div className="settings-page__white-list-items__item" key={index}>
                <div> {item}</div>
                <button onClick={() => this.handleRemove(item)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
