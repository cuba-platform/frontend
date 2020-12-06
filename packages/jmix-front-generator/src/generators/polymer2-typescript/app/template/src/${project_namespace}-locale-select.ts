<%  const className = genClassName('LocaleSelect'); %>
/// <reference path="../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
/// <reference path="../bower_components/cuba-app/cuba-app-aware-behavior.d.ts" />
namespace <%= project.namespace %> {

  const {customElement, property, observe} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaAppAwareBehavior
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= project.namespace %>-locale-select')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaAppAwareBehavior, CubaLocalizeBehavior], Polymer.Element) as
    new () => Polymer.Element & CubaAppAwareBehavior & CubaLocalizeBehavior) {

    @property({type: Object})
    locale: string;

    @observe('app')
    _init() {

    }

    _changeLocale(event: CustomEvent) {
      this.app!.locale = event.detail.value;
    }
  }

}
