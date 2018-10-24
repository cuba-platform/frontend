import {action, autorun, computed, IObservableArray, observable, runInAction} from "mobx";
import {cubaREST} from "<%= relDirShift %>index";
import {EntitiesLoadOptions} from "@cuba-platform/rest";
import {DEFAULT_COUNT} from "<%= relDirShift %>config";

export class <%=entity.className%>Part {
  static ENTITY_NAME = '<%=entity.name%>';
  static VIEW = '<%=view.name%>';
  static PROPERTIES = [<%view.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];
  _instanceName: string;
  id: string;
  <% if (view) { for (let i = 0; i < view.allProperties.length ; i++) { %><%=view.allProperties[i].name %>: any;
  <%}}%>
}

export class <%=className%>Store {

  static NAME = '<%=nameLiteral%>Store';

  @observable loading = false;
  @observable entities: IObservableArray<<%=entity.className%>Part> = observable([]);
  @observable offset = 0;
  @observable count: number;

  constructor() {

    autorun(() => {
      this.loading = true;
      cubaREST.loadEntitiesWithCount('<%=entity.name%>', this.loadOptions)
        .then((resp) => {
          runInAction(() => {
            this.count = resp.count;
            this.entities = observable([...this.entities, ...(resp.result as <%=entity.className%>Part[])]);
            this.loading = false;
          })
        })
        .catch(action(() => {
          this.loading = false;
        }));
    });
  }

  @action
  loadMore = () => {
    this.offset += DEFAULT_COUNT;
  };

  @computed
  get initializing(): boolean {
    return this.count == null && this.loading;
  }

  @computed
  get moreEntitiesAvailable(): boolean {
    return this.count != null && this.entities.length < this.count;
  }

  @computed
  private get loadOptions(): EntitiesLoadOptions {
    return {
      view: <%=entity.className%>Part.VIEW,
      offset: this.offset,
      limit: DEFAULT_COUNT
    }
  }
}

