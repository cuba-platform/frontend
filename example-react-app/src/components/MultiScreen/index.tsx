import React from 'react';
import { IMultiScreenItem, multiScreenState } from 'globalState/multiScreen';

import styles from './styles.module.scss';
import { observer } from 'mobx-react';

export const MultiScreenContext = React.createContext<IMultiScreenItem>(null!);

export interface IMultiScreenProps {
    children?: React.ReactNode;
}

export const MultiScreen = observer((props: IMultiScreenProps) => {
    multiScreenState.props = props;

    let content = props.children;
    if (multiScreenState.screens.length) {
        content = multiScreenState.screens.map((item, index) => {
            let params = {} as { key?: string };
            // If we render last screen than force "create" it because {item} link can be same, but other params can be changes (example edit screen with another entityId param)
            if (index === multiScreenState.screens.length - 1) {
                params.key = Math.random() + '';
            }

            return <MultiScreenItem item={item} {...params} />;
        });
    }

    return (
        <div>
            <Breadcrumbs />
            <div>
                {content}
            </div>
        </div>
    );
});

interface IMultiScreenItemProps {
    item: IMultiScreenItem;
}

export const MultiScreenItem = observer((props: IMultiScreenItemProps) => {
    const {item} = props;

    const style: any = {};
    if (multiScreenState.currentScreen !== null && multiScreenState.currentScreen !== item) {
        style.display = 'none';
    }

    return (
        <span style={style}>
            <MultiScreenContext.Provider value={item}>
                {item.content}
            </MultiScreenContext.Provider>
        </span>
    );
});

const Breadcrumbs = observer(() => {
    if (multiScreenState.screens.length <= 1) return null;

    return (
        <div className={styles.breadcrumbs}>
            {Array.from(multiScreenState.screens).map((screen) => <Breadcrumb screen={screen} />)}
        </div>
    );
});

interface IBreadcrumbProps {
    screen: IMultiScreenItem;
}

const Breadcrumb = observer((props: IBreadcrumbProps) => {
    const {screen} = props;

    function handleClick() {
        multiScreenState.setActiveScreen(screen);
    }

    return (
        <span onClick={handleClick}
              className={styles.breadcrumb}
              data-active={multiScreenState.currentScreen === screen}>
            <span>{screen.title}</span>
        </span>
    );
});

