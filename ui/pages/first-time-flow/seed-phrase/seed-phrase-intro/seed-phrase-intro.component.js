import React from 'react';
import { useHistory } from 'react-router-dom';
import { useI18nContext } from '../../../../hooks/useI18nContext';
// Components
import Box from '../../../../components/ui/box';
import Button from '../../../../components/ui/button';
import Typography from '../../../../components/ui/typography';
import {
  BLOCK_SIZES,
  COLORS,
  TYPOGRAPHY,
} from '../../../../helpers/constants/design-system';
// Routes
import { INITIALIZE_SEED_PHRASE_ROUTE } from '../../../../helpers/constants/routes';

export default function SeedPhraseIntro() {
  const t = useI18nContext();
  const history = useHistory();

  const handleNextStep = () => {
    history.push(INITIALIZE_SEED_PHRASE_ROUTE);
  };

  const subtitles = {
    en: 'English',
    es: 'Spanish',
    hi: 'Hindi',
    id: 'Indonesian',
    ja: 'Japanese',
    ko: 'Korean',
    pt: 'Portuguese',
    ru: 'Russian',
    tl: 'Tagalog',
    vi: 'Vietnamese',
  };

  return (
    <div className="seed-phrase-intro">
      <div className="seed-phrase-intro__content">
        <Typography
          variant={TYPOGRAPHY.H1}
          boxProps={{ marginTop: 0, marginBottom: 4 }}
        >
          {t('seedPhraseIntroTitle')}
        </Typography>
        <Typography
          boxProps={{ marginBottom: 4 }}
          variant={TYPOGRAPHY.Paragraph}
          className="seed-phrase-intro__copy"
        >
          {t('seedPhraseIntroTitleCopy')}
        </Typography>
        <Box width={BLOCK_SIZES.ONE_THIRD}>
          <Button
            className="seed-phrase-intro__button"
            onClick={handleNextStep}
          >
            {t('next')}
          </Button>
        </Box>
      </div>
    </div>
  );
}
