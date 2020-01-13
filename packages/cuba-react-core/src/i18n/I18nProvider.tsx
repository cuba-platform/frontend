import * as React from 'react';
import {Locale} from 'antd/es/locale-provider';
import {observer} from 'mobx-react';
import {MainStoreInjected} from '../app/MainStore';
import {ConfigProvider} from 'antd';
import {IntlProvider} from 'react-intl';

type I18nProviderProps = MainStoreInjected & {
  messagesMapping: Record<string, Record<string, string> | undefined>,
  antdLocaleMapping: Record<string, Locale | undefined>,
  children: React.ReactNode | React.ReactNode[] | null,
}

export const I18nProvider = observer(({messagesMapping, antdLocaleMapping, mainStore, children}: I18nProviderProps) => {
  return (
    <IntlProvider locale={mainStore!.locale!} messages={messagesMapping[mainStore!.locale!]}>
      <ConfigProvider locale={antdLocaleMapping[mainStore!.locale!]}>
        {children}
      </ConfigProvider>
    </IntlProvider>
  );
});
