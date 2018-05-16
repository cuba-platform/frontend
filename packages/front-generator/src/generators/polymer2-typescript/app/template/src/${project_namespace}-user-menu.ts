<%  const className = genClassName('UserMenu'); %>
/// <reference path="../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
/// <reference path="../bower_components/cuba-app/cuba-app-aware-behavior.d.ts" />
namespace <%= project.namespace %> {

  const {customElement} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= project.namespace %>-user-menu')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaAppAwareBehavior, CubaLocalizeBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior & CubaAppAwareBehavior) {

    _logout() {
      this.app!.logout().then(function () {
        const baseEl = document.querySelector('base');
        window.location.href = baseEl ? baseEl.href : '/';
      });
    }
  }

}