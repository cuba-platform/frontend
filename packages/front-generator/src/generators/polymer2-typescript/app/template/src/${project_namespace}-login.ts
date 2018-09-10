<%  const className = genClassName('Login'); %>
/// <reference path="../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
namespace <%= project.namespace %> {

  const {customElement, query} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= project.namespace %>-login')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior) {

    @query('#loginError')
    loginError: any;

    _handleLoginError() {
      this.loginError.show();
    }
  }

}