<%  const className = genClassName('Home'); %>
/// <reference path="../../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
namespace <%= project.namespace %> {

  const {customElement, property} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= project.namespace %>-home')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior) {

    @property({type: Object})
    messages: {} = {
      en: {
        "welcomeHeading": "Welcome to <%= project.namespace %>",
        "welcomeContent": "Some description"
      }
    }
  }
}