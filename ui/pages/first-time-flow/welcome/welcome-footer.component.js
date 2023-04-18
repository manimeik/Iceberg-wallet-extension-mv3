import React from 'react';
import { useI18nContext } from '../../../hooks/useI18nContext';

const WelcomeFooter = () => {
  const t = useI18nContext();

  return (
    <>
      <div className="welcome-page__header">{t('welcome')}</div>
      <img width="269" src="/images/logo/iceberg-horizontal.svg" alt="" />
      <div className="welcome-page__description">
        <p>{t('metamaskDescription')}</p>
      </div>
    </>
  );
};

export default WelcomeFooter;
