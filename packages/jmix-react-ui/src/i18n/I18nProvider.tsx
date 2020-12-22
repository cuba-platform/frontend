import * as React from 'react';
import {Locale} from 'antd/es/locale-provider';
import {observer} from 'mobx-react';
import {ConfigProvider} from 'antd';
import {IntlProvider} from 'react-intl';
import {getMainStore} from '@haulmont/jmix-react-core';

type I18nProviderProps = {
  messagesMapping: Record<string, Record<string, string> | undefined>,
  antdLocaleMapping: Record<string, Locale | undefined>,
  children: React.ReactNode | React.ReactNode[] | null,
}

export const I18nProvider = observer(({messagesMapping, antdLocaleMapping, children}: I18nProviderProps) => {
  const mainStore = getMainStore();

  if (!mainStore || !mainStore.locale) {
    return null;
  }

  return (
    <IntlProvider locale={mainStore.locale} messages={messagesMapping[mainStore.locale]}>
      <ConfigProvider locale={antdLocaleMapping[mainStore.locale]}>
        {children}
      </ConfigProvider>
    </IntlProvider>
  );
});
