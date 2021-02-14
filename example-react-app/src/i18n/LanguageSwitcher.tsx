import React, { CSSProperties } from "react";
import { Select } from "antd";
import { getMainStore } from "@haulmont/jmix-react-core";
import localeCaptions from "./localeCaptions";
import "./LanguageSwitcher.css";

export interface LanguageSwitcherProps {
  className?: string;
  style?: CSSProperties;
}

export class LanguageSwitcher extends React.Component<LanguageSwitcherProps> {
  localeOptions: string[] = ["en"];

  handleChange = (locale: string) => {
    getMainStore().setLocale(locale);
  };

  render() {
    if (this.localeOptions.length === 1) {
      return null; // Do not show LanguageSwitcher if there is only a single locale option
    }

    return (
      <Select
        defaultValue={getMainStore().locale}
        onChange={this.handleChange}
        size={"small"}
        style={this.props.style}
        bordered={false}
        className={this.props.className}
        dropdownMatchSelectWidth={false}
      >
        {this.localeOptions.map(locale => (
          <Select.Option key={locale} value={locale}>
            {localeCaptions[locale]}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
