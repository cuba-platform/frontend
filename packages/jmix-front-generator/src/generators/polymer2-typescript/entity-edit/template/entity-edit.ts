/// <reference path="../../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
/// <reference path="../../bower_components/cuba-ui/cuba-entity-edit-view-behavior.d.ts" />
namespace <%= projectNamespace %> {

  const {customElement} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   * @appliesMixin CubaEntityEditViewBehavior
   */
  @customElement('<%= componentName %>')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior, CubaEntityEditViewBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior & CubaEntityEditViewBehavior){
  }
}