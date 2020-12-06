<%  const className = genClassName('Menu'); %>
/// <reference path="../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
namespace <%= project.namespace %> {
  const {customElement, property} = Polymer.decorators;

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%=project.namespace%>-menu')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior], Polymer.Element) as
    new() => Polymer.Element & CubaLocalizeBehavior){

    @property({type: String})
    path: string;

    navigate(event: Event) {
      let destinationPath = (event.target as HTMLElement).dataset.path;
      if (destinationPath != null) {
        this.path = '/' + destinationPath;
        this.dispatchEvent(new CustomEvent('menu-navigate'));
      }
    }

    _computeSelectedItem(page: string) {
      return page || '';
    }
  }

}