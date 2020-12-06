<% const className = genClassName('Shell') %>
/// <reference path="../bower_components/cuba-app/cuba-app.d.ts" />
/// <reference path="../bower_components/app-layout/app-drawer/app-drawer.d.ts" />
/// <reference path="../bower_components/app-layout/app-drawer-layout/app-drawer-layout.d.ts" />
namespace <%= project.namespace %> {

  const {customElement, property, observe, query} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaAppAwareBehavior
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= project.namespace %>-shell')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaAppAwareBehavior, CubaLocalizeBehavior], Polymer.Element) as
    new () => Polymer.Element & CubaAppAwareBehavior & CubaLocalizeBehavior) {

    @property({type: Boolean})
    authenticated: boolean;

    @property({type: String})
    apiUrl: string;

    @query('#drawer')
    drawer: AppDrawerElement;

    @query('#drawerLayout')
    drawerLayout: AppDrawerLayoutElement;

    ready() {
      super.ready();
      this.addEventListener('navigate', this._onNavigate);
    }

    @observe('app')
    _init(app: cuba.CubaApp) {
      if (!app) {
        return;
      }
      if (app.restApiToken) {
        app.loadEnums().then(() => {
          this.authenticated = true;
        });
        app.loadEntitiesMessages();
      } else {
        this.authenticated = false;
      }
    }

    _handleLogin() {
      this.authenticated = true;
      this.app!.loadEnums();
      this.app!.loadEntitiesMessages();
    }

    _handleTokenExpired() {
      this.authenticated = false;
    }

    _closeDrawer() {
      Polymer.Async.microTask.run(() => {
        if (this.drawerLayout && this.drawerLayout.narrow) {
          this.drawer.close();
        }
      });
    }

    _computeSelectedPage(page: string) {
      return page || '';
    }

    _onNavigate(event: CustomEvent) {
      this.set("route.path", event.detail);
    }

  }
}