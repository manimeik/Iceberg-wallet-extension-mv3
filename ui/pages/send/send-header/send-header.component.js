import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageContainerHeader from '../../../components/ui/page-container/page-container-header';
import { getMostRecentOverviewPage } from '../../../ducks/history/history';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  getSendAsset,
  getSendStage,
  resetSendState,
  SEND_STAGES,
} from '../../../ducks/send';
import { ASSET_TYPES } from '../../../../shared/constants/transaction';

export default function SendHeader() {
  const history = useHistory();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const dispatch = useDispatch();
  const stage = useSelector(getSendStage);
  const asset = useSelector(getSendAsset);
  const t = useI18nContext();

  const onClose = () => {
    dispatch(resetSendState());
    history.push(mostRecentOverviewPage);
  };

  let title = asset.type === ASSET_TYPES.NATIVE ? t('transfer') : t('sendTokens');

  if (stage === SEND_STAGES.ADD_RECIPIENT || stage === SEND_STAGES.INACTIVE) {
    title = t('transferTo');
  } else {if (stage === SEND_STAGES.EDIT) {
    title = t('edit');
  }
  else title = t('transfer');

}

  return (
    <PageContainerHeader
      className="send__header"
      onClose={onClose}
      title={title}
      headerCloseText={
        stage === SEND_STAGES.EDIT ? t('cancelEdit') : t('back')
      }
      hideClose={false}
    />
  );
}
