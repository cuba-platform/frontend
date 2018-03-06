declare interface EventInit {
 composed: boolean;
}


@Polymer.decorators.customElement('my-app')
class MyApp extends Polymer.Element {

    @Polymer.decorators.property({
        type: String,
        reflectToAttribute: true
    })
    page: string;

    @Polymer.decorators.property({type: Object})
    routeData: {};

    @Polymer.decorators.property({type: String})
    subroute: string;
    // This shouldn't be neccessary, but the Analyzer isn't picking up
    // Polymer.Element#rootPath

    @Polymer.decorators.property({type: String})
    rootPath: string;

    @Polymer.decorators.query('#drawer')
    drawer: {persistent: boolean, close: () => {}}; //todo type


    @Polymer.decorators.observe('routeData.page')
    _routePageChanged(page: string|null) {
        // If no page was found in the route data, page will be an empty string.
        // Default to 'view1' in that case.
        this.page = page || 'view1';

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.drawer.persistent) {
            this.drawer.close();
        }
    }

    @Polymer.decorators.observe('page')
    _pageChanged(page: string|null) {
        // Load page import on demand. Show 404 page if fails
        const resolvedPageUrl = this.resolveUrl('my-' + page + '.html');
        Polymer.importHref(
            resolvedPageUrl,
            undefined,
            this._showPage404.bind(this),
            true);
    }

    _showPage404() {
        this.dispatchEvent(new CustomEvent('aa', {detail: 'aa', composed: true}));
        this.page = 'view404';
    }
}