import {action, reaction, computed, IObservableArray, observable, runInAction, toJS} from "mobx";
import {cubaREST} from "<%= relDirShift %>index";
import {EntitiesLoadOptions} from "@cuba-platform/rest";
import {DEFAULT_COUNT} from "<%= relDirShift %>config";
import {AppState, getPropertyInfo, PropertyType} from "<%= relDirShift %>app/AppState";
import * as moment from "moment";

export class Browse<%=entity.className%>Part {
  static ENTITY_NAME = '<%=entity.name%>';
  static VIEW = '<%=listView.name%>';
  static PROPERTIES = [<%listView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];
  _instanceName: string;
  id: string;
  <% if (listView) { for (let i = 0; i < listView.allProperties.length ; i++) { %><%=listView.allProperties[i].name%>: any;
  <%}}%>
}

export class Edit<%=entity.className%>Part {
  static ENTITY_NAME = '<%=entity.name%>';
  static VIEW = '<%=editView.name%>';
  static PROPERTIES = [<%editView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];
  _instanceName: string;
  id: string;
  <% if (editView) { for (let i = 0; i < editView.allProperties.length ; i++) {%><%-editView.allProperties[i].name%>: any;
  <%}}%>
}

export class <%=className%>Store {

  static NAME = '<%=nameLiteral%>Store';

  appState: AppState;

  @observable isLoadingList = false;
  @observable entityList: IObservableArray<Browse<%=entity.className%>Part> = observable([]);
  @observable offset = 0;
  @observable count: number;

  @observable isLoadingEntity = false;
  @observable entity: Edit<%=entity.className%>Part | null;
  @observable isCommittingEntity = false;

  @observable deleting = false;

  constructor(appState: AppState) {
    this.appState = appState;
    reaction(
      () => this.loadOptions,
      () => this.loadEntities(),
      {fireImmediately: true}
    );
  }

  @action
  loadMore = () => {
    this.offset += DEFAULT_COUNT;
  };

  @action
  deleteEntity = (e: Browse<%=entity.className%>Part): Promise<any> => {
    this.deleting = true;
    return cubaREST.deleteEntity('<%=entity.name%>', e.id)
      .then(action(() => {
        this.deleting = false;
        this.loadEntities();
        return true;
      }))
      .catch(action(() => {
        this.deleting = false;
        return true;
      }));
  };

  @action
  loadEntities = () => {
    this.isLoadingList = true;
    cubaREST.loadEntitiesWithCount('<%=entity.name%>', this.loadOptions)
      .then((resp) => {
        runInAction(() => {
          this.count = resp.count;
          this.entityList = observable(resp.result as Edit<%=entity.className%>Part[]);
          this.isLoadingList = false;
        })
      })
      .catch(action(() => {
        this.isLoadingList = false;
      }));
  };

  @action
  loadEntity = (id?: string) => {
    this.entity = null;
    if (id == null) {
      return;
    }
    this.isLoadingEntity = true;
    cubaREST.loadEntity('<%=entity.name%>', id, {view: Edit<%=entity.className%>Part.VIEW})
      .then(action((e: Edit<%=entity.className%>Part) => {
        this.entity = e;
        this.isLoadingEntity = false;
      }))
      .catch(action(() => {
        this.isLoadingEntity = false;
      }));
  };

  @action
  updateEntity(entityPatch: Partial<Edit<%=entity.className%>Part>): Promise<any> {
    Object.assign(this.entity, entityPatch);
    this.isCommittingEntity = true;
    return cubaREST.commitEntity('<%=entity.name%>', this.entity)
      .then(action(() => {
        this.isCommittingEntity = false;
        this.loadEntities();
      }))
      .catch(action((e) => {
        this.isCommittingEntity = false;
        throw e;
      }));
  }

  @action
  createEntity(): void {
    this.entity = new Edit<%=entity.className%>Part();
  }

  @computed
  get initializing(): boolean {
    return this.count == null && this.isLoadingList;
  }

  @computed
  get moreEntitiesAvailable(): boolean {
    return this.count != null && this.entityList.length < this.count;
  }

  @computed
  get isEmpty(): boolean {
    return !this.initializing && !this.isLoadingList && this.entityList.length < 1;
  }

  @computed
  private get loadOptions(): EntitiesLoadOptions {
    return {
      offset: this.offset,
      limit: DEFAULT_COUNT,
      view: Browse<%=entity.className%>Part.VIEW,
      sort: '-updateTs'
    }
  }

  @computed
  get fieldValues(): Partial<Edit<%=entity.className%>Part> {
    const {metadata} = this.appState;
    if (this.entity == null || metadata == null) {
      return {};
    }
    const entity = this.entity ? toJS(this.entity) : {};
    const entityFields: Partial<Edit<%=entity.className%>Part> = Edit<%=entity.className%>Part.PROPERTIES.reduce(
      (acc, propertyName) => {
        const propertyInfo = getPropertyInfo(toJS(metadata), Edit<%=entity.className%>Part.ENTITY_NAME, propertyName);
        if (propertyInfo == null) {
          acc[propertyName] = entity[propertyName];
          return acc;
        }
        if (propertyInfo.type as PropertyType === "date") {
          acc[propertyName] = moment(entity[propertyName]);
          return acc;
        } else {
          acc[propertyName] = entity[propertyName];
          return acc;
        }
      },
      {}
    );
    return entityFields;
  }
}