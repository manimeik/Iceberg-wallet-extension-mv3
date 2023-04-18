// import React, { useMemo, useContext } from 'react';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';
// import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import Identicon from '../../ui/identicon';
// import ListItem from '../../ui/list-item';
// import Tooltip from '../../ui/tooltip';
// import InfoIcon from '../../ui/icon/info-icon.component';
// import Button from '../../ui/button';
// import { useI18nContext } from '../../../hooks/useI18nContext';
// import { updateSendAsset } from '../../../ducks/send';
// import { SEND_ROUTE } from '../../../helpers/constants/routes';
// import { SEVERITIES } from '../../../helpers/constants/design-system';
// import { INVALID_ASSET_TYPE } from '../../../helpers/constants/error-keys';
// import { ASSET_TYPES } from '../../../../shared/constants/transaction';
// import { MetaMetricsContext } from '../../../contexts/metametrics.new';

// const AssetListItem = ({
//   className,
//   'data-testid': dataTestId,
//   iconClassName,
//   onClick,
//   tokenAddress,
//   tokenSymbol,
//   tokenDecimals,
//   tokenImage,
//   warning,
//   primary,
//   secondary,
//   identiconBorder,
//   isERC721,
// }) => {
//   const t = useI18nContext();
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const trackEvent = useContext(MetaMetricsContext);
//   const titleIcon = warning ? (
//     <Tooltip
//       wrapperClassName="asset-list-item__warning-tooltip"
//       interactive
//       position="bottom"
//       html={warning}
//     >
//       <InfoIcon severity={SEVERITIES.WARNING} />
//     </Tooltip>
//   ) : null;

//   const midContent = warning ? (
//     <>
//       <InfoIcon severity={SEVERITIES.WARNING} />
//       <div className="asset-list-item__warning">{warning}</div>
//     </>
//   ) : null;

//   const sendTokenButton = useMemo(() => {
//     if (tokenAddress === null || tokenAddress === undefined) {
//       return null;
//     }
//     return (
//       <Button
//         type="link"
//         className="asset-list-item__send-token-button"
//         onClick={async (e) => {
//           e.stopPropagation();
//           trackEvent({
//             event: 'Clicked Send: Token',
//             category: 'Navigation',
//             properties: {
//               action: 'Home',
//               legacy_event: true,
//             },
//           });
//           try {
//             await dispatch(
//               updateSendAsset({
//                 type: ASSET_TYPES.TOKEN,
//                 details: {
//                   address: tokenAddress,
//                   decimals: tokenDecimals,
//                   symbol: tokenSymbol,
//                 },
//               }),
//             );
//             history.push(SEND_ROUTE);
//           } catch (err) {
//             if (!err.message.includes(INVALID_ASSET_TYPE)) {
//               throw err;
//             }
//           }
//         }}
//       >
//         {t('sendSpecifiedTokens', [tokenSymbol])}
//       </Button>
//     );
//   }, [
//     tokenSymbol,
//     trackEvent,
//     tokenAddress,
//     tokenDecimals,
//     history,
//     t,
//     dispatch,
//   ]);

//   return (
//     <ListItem
//       className={classnames('asset-list-item', className)}
//       data-testid={dataTestId}
//       title={
//         <button
//           className="asset-list-item__token-button"
//           onClick={onClick}
//           title={`${primary} ${tokenSymbol}`}
//         >
//           <h2>
//             <span className="asset-list-item__token-value">{primary}</span>
//             <span className="asset-list-item__token-symbol">{tokenSymbol}</span>
//           </h2>
//         </button>
//       }
//       titleIcon={titleIcon}
//       subtitle={secondary ? <h3 title={secondary}>{secondary}</h3> : null}
//       onClick={onClick}
//       icon={
//         <Identicon
//           className={iconClassName}
//           diameter={32}
//           address={tokenAddress}
//           image={tokenImage}
//           alt={`${primary} ${tokenSymbol}`}
//           imageBorder={identiconBorder}
//         />
//       }
//       midContent={midContent}
//       rightContent={
//         !isERC721 && (
//           <>
//             <i className="fas fa-chevron-right asset-list-item__chevron-right" />
//             {sendTokenButton}
//           </>
//         )
//       }
//     />
//   );
// };

// AssetListItem.propTypes = {
//   className: PropTypes.string,
//   'data-testid': PropTypes.string,
//   iconClassName: PropTypes.string,
//   onClick: PropTypes.func.isRequired,
//   tokenAddress: PropTypes.string,
//   tokenSymbol: PropTypes.string,
//   tokenDecimals: PropTypes.number,
//   tokenImage: PropTypes.string,
//   warning: PropTypes.node,
//   primary: PropTypes.string,
//   secondary: PropTypes.string,
//   identiconBorder: PropTypes.bool,
//   isERC721: PropTypes.bool,
// };

// AssetListItem.defaultProps = {
//   className: undefined,
//   'data-testid': undefined,
//   iconClassName: undefined,
//   tokenAddress: undefined,
//   tokenImage: undefined,
//   warning: undefined,
// };

// export default AssetListItem;


import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Identicon from '../../ui/identicon';
import { MetaMetricsContext } from '../../../contexts/metametrics.new';
import Tooltip from '../../ui/tooltip';
import InfoIcon from '../../ui/icon/info-icon.component';
import Button from '../../ui/button';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { ASSET_TYPES, updateSendAsset } from '../../../ducks/send';
import { SEND_ROUTE } from '../../../helpers/constants/routes';
import { SEVERITIES } from '../../../helpers/constants/design-system';

function ListItem({
  title,
  subtitle,
  onClick,
  children,
  titleIcon,
  icon,
  midContent,
  tokenSymbol,
  className,
  'data-testid': dataTestId,
}) {
  const primaryClassName = classnames(
    className,
    subtitle || children ? '' : 'list-item--single-content-row',
  );

  return (
    <div
      className={primaryClassName}
      onClick={onClick}
      data-testid={dataTestId}
      role="button"
      tabIndex={0}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          onClick();
        }
      }}
    >
      <div className="asset-list-item__icon-title">
        {icon ? <div className="asset-list-item__icon">{icon}</div> : null}
        <div>
          <h2 className="asset-list-item__title">{tokenSymbol}</h2>
        </div>
      </div>
      <div className="asset-list-item__heading-subheading">
        <div className="asset-list-item__heading">
          {React.isValidElement(title) ? (
            title
          ) : (
            <h2 className="asset-list-item__title">{title}</h2>
          )}
          {titleIcon && (
            <div className="asset-list-item__heading-wrap">{titleIcon}</div>
          )}
        </div>
        {subtitle ? (
          <div className="asset-list-item__subheading">{subtitle}</div>
        ) : null}
      </div>
      {children ? (
        <div className="asset-list-item__actions">{children}</div>
      ) : null}
      {midContent ? (
        <div className="asset-list-item__mid-content">{midContent}</div>
      ) : null}
    </div>
  );
}

ListItem.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleIcon: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node,
  icon: PropTypes.node,
  rightContent: PropTypes.node,
  midContent: PropTypes.node,
  tokenSymbol: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  'data-testid': PropTypes.string,
};

const AssetListItem = ({
  className,
  'data-testid': dataTestId,
  iconClassName,
  onClick,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
  warning,
  primary,
  secondary,
  identiconBorder,
  isERC721,
}) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const trackEvent = useContext(MetaMetricsContext);
  const titleIcon = warning ? (
    <Tooltip
      wrapperClassName="asset-list-item__warning-tooltip"
      interactive
      position="bottom"
      html={warning}
    >
      <InfoIcon severity={SEVERITIES.WARNING} />
    </Tooltip>
  ) : null;

  const midContent = warning ? (
    <>
      <InfoIcon severity={SEVERITIES.WARNING} />
      <div className="asset-list-item__warning">{warning}</div>
    </>
  ) : null;

  const sendTokenButton = useMemo(() => {
    if (tokenAddress === null || tokenAddress === undefined) {
      return null;
    }
    return (
      <Button
        type="link"
        className="asset-list-item__send-token-button"
        onClick={(e) => {
          e.stopPropagation();
          trackEvent({
                        event: 'Clicked Send: Token',
                        category: 'Navigation',
                        properties: {
                          action: 'Home',
                          legacy_event: true,
                        },
                      });
          dispatch(
            updateSendAsset({
              type: ASSET_TYPES.TOKEN,
              details: {
                address: tokenAddress,
                decimals: tokenDecimals,
                symbol: tokenSymbol,
              },
            }),
          ).then(() => {
            history.push(SEND_ROUTE);
          });
        }}
      >
        {t('sendSpecifiedTokens', [tokenSymbol])}
      </Button>
    );
  }, [
    tokenSymbol,
    trackEvent,
    tokenAddress,
    tokenDecimals,
    history,
    t,
    dispatch,
  ]);

  return (
    <ListItem
      className={classnames('asset-list-item', className)}
      data-testid={dataTestId}
      tokenSymbol={tokenSymbol}
      title={
        <button
          className="asset-list-item__token-button"
          onClick={onClick}
          title={`${primary} ${tokenSymbol}`}
        >
          <h2>
            <span className="asset-list-item__token-value">{primary}</span>
            <span className="asset-list-item__token-symbol">{tokenSymbol}</span>
          </h2>
        </button>
      }
      titleIcon={titleIcon}
      subtitle={secondary ? <h3 title={secondary}>{secondary}</h3> : null}
      onClick={onClick}
      icon={
        <Identicon
          className={iconClassName}
          diameter={32}
          address={tokenAddress}
          image={tokenImage}
          alt={`${primary} ${tokenSymbol}`}
          imageBorder={identiconBorder}
        />
      }
      midContent={midContent}
    />
  );
};

AssetListItem.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  tokenAddress: PropTypes.string,
  tokenSymbol: PropTypes.string,
  tokenDecimals: PropTypes.number,
  tokenImage: PropTypes.string,
  warning: PropTypes.node,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  identiconBorder: PropTypes.bool,
  isERC721: PropTypes.bool,
};

AssetListItem.defaultProps = {
  className: undefined,
  'data-testid': undefined,
  iconClassName: undefined,
  tokenAddress: undefined,
  tokenImage: undefined,
  warning: undefined,
};

export default AssetListItem;
