/// <reference path="../../bower_components/cuba-app/cuba-localize-behavior.d.ts" />
/// <reference path="../../bower_components/cuba-ui/cuba-entity-list-view-behavior.d.ts" />

namespace <%= projectNamespace %> {

  const {customElement, property, query} = Polymer.decorators;
  const defaultEventOptions = {
    bubbles: true,
    composed: true
  };

  /**
   * @extends {Polymer.Element}
   * @appliesMixin CubaLocalizeBehavior
   */
  @customElement('<%= componentName %>')
  class <%= className %> extends (Polymer.mixinBehaviors([CubaLocalizeBehavior], Polymer.Element) as
    new () => Polymer.Element & CubaLocalizeBehavior) {

    @property({type: Boolean})
    active: boolean = false;

    @property({type: Object})
    route: { prefix: string };

    @property({type: Object})
    actionRouteData: object;

    @property({type: Object})
    actionRouteTail: object;

    @property({type: Boolean})
    actionRouteActive: boolean;

    @property({type: Object})
    idRouteData: { id?: string };

    @property({type: Boolean})
    idRouteActive: boolean;

    @property({type: Boolean, computed: '_computeShowEditor(route, active, actionRouteActive)'})
    showEditor: boolean = false;

    @property({type: String, computed: '_computeEditedEntityId(route, idRouteActive, idRouteData.id)'})
    editedEntityId: string;

    @query('#successMessage')
    successMessageEl: any;

    _computeShowEditor() {
      return this.active && this.actionRouteActive;
    }

    _computeEditedEntityId() {
      return this.idRouteActive ? this.idRouteData.id : null;
    }

    _reload() {
      const listComponent: <%=listComponentClass%> | null = this.shadowRoot!.querySelector('#list');
      if (listComponent) {
        listComponent.reload();
      }
    }

    _createEntity() {
      const eventOptions = {
        ...defaultEventOptions,
        detail: this.route.prefix + '/new'
      };
      this.dispatchEvent(new CustomEvent('navigate', eventOptions));
    }

    _editEntity(event: CustomEvent) {
      const eventOptions = {
        ...defaultEventOptions,
        detail: this.route.prefix + '/edit/' + event.detail.id
      };
      this.dispatchEvent(new CustomEvent('navigate', eventOptions));
    }

    _deleteEntity(event: CustomEvent) {
      const listComponent: <%=listComponentClass%> | null = this.shadowRoot!.querySelector('#list');
      if (listComponent) {
        listComponent.remove(event.detail.entity);
      }
      this._closeEditor();
    }

    _onEditorCommit() {
      const listComponent: <%=listComponentClass%> | null = this.shadowRoot!.querySelector('#list');
      if (listComponent) {
        listComponent.reload();
      }
      this.successMessageEl.open();
      this._closeEditor();
    }

    _closeEditor() {
      const eventOptions = {
        ...defaultEventOptions,
        detail: this.route.prefix
      };
      this.dispatchEvent(new CustomEvent('navigate', eventOptions))
    }
  }
}
