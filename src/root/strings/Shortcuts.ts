import conf from '../../res/ClientConfig';

/**
 * Default enumerations to reduce strings in translations.
 */
const shortcuts = {
  yellow: `${conf.extBracketsOpen}color${conf.extSplitter}YELLOW${conf.extBracketsClose}`,
  red: `${conf.extBracketsOpen}color${conf.extSplitter}RED${conf.extBracketsClose}`,
  ephemeral: `${conf.extBracketsOpen}ephemeral${conf.extSplitter}true${conf.extBracketsClose}`,
} as const;

export default shortcuts;
