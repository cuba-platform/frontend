/// <reference path="../../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
/// <reference path="../../bower_components/cuba-ui/cuba-entity-list-view-behavior.d.ts" />
namespace <%= projectNamespace %> {

  const {customElement} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   * @appliesMixin CubaEntityListViewBehavior
   */
  @customElement('<%= componentName %>')
  export class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior, CubaEntityListViewBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior & CubaEntityListViewBehavior) {
  }
}
