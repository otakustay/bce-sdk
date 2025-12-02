import type {UserConfig} from '@commitlint/types';
import {RuleConfigSeverity} from '@commitlint/types';

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 400],
        'body-max-line-length': [RuleConfigSeverity.Disabled],
    },
};

export default config;
