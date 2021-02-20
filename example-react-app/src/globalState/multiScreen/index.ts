import { computed, observable } from "mobx";
import React from "react";
import { IMultiScreenProps } from "components/MultiScreen";
import { currentRootPageData } from "globalState/currentRootPageData";
import { sleep } from "helpers/misc";

export interface IMultiScreenItem {
  title: string;
  content: React.ReactNode;
  parent?: IMultiScreenItem;
  params?: {
    entityId?: string;
  };
}

export class MultiScreenState {
  props: IMultiScreenProps = null!;
  @observable.ref screens: IMultiScreenItem[] = [];
  @observable.ref currentScreen: IMultiScreenItem = null!;

  get content() {
    const { screens, currentScreen, props } = this;
    if (screens.length === 0) {
      return props.children;
    }

    for (const screen of screens) {
      if (screen === currentScreen) {
        return screen.content;
      }
    }

    return props.children;
  }

  get currentScreenIndex() {
    const { screens, currentScreen, props } = this;
    let index = 0;

    for (const screen of screens) {
      if (screen === currentScreen) {
        return index;
      }

      index++;
    }

    return index;
  }

  reset = () => {
    this.screens = [];
    this.currentScreen = null!;
    //this.props = null;
  };

  pushScreen = (screen: IMultiScreenItem) => {
    const lastScreen = this.screens[this.screens.length - 1] ?? null;
    let newScreens = [...this.screens];
    let parentScreen = null;

    if (newScreens.length === 0) {
      const firstScreen = {
        title: currentRootPageData.title,
        content: this.props.children
      };
      parentScreen = firstScreen;

      newScreens.push(firstScreen);
    } else {
      parentScreen = this.currentScreen;

      if (lastScreen !== this.currentScreen) {
        newScreens = [];
        for (const screen of this.screens) {
          newScreens.push(screen);

          if (screen === this.currentScreen) {
            break;
          }
        }
      }
    }

    screen.parent = parentScreen;

    this.currentScreen = screen;
    newScreens.push(screen);

    this.screens = [...newScreens];
  };

  setActiveScreen = (
    screen: IMultiScreenItem,
    removeScreensToRight = false
  ) => {
    this.currentScreen = screen;

    if (removeScreensToRight) {
      const newScreens = [];
      for (const screen of this.screens) {
        newScreens.push(screen);

        if (screen === this.currentScreen) {
          break;
        }
      }

      this.screens = newScreens;
    }
  };
}

export const multiScreenState = new MultiScreenState();
