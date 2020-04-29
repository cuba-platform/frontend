import {formFieldsToInstanceItem, instanceItemToFormFields, stripTemporaryIds} from './Instance';
import {AttributeType, Cardinality} from '@cuba-platform/rest';
import moment from 'moment';

describe('formFieldsToInstanceItem', () => {
  it('does not remove temporary id', () => {
    const patch = {id: '_CUBA_TEMPORARY_ENTITY_ID_7283974224', stringAttr: 'Some value'};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch).toEqual(patch);
  });

  it('does not remove normal id', () => {
    const patch = {id: 'fed2c837-e451-4ffb-aea8-51291c073438', stringAttr: 'Some value'};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch).toEqual(patch);
  });

  it('transforms temporal property', () => {
    const patch = {dateAttr: moment('2020-03-01', 'YYYY-MM-DD')};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.dateAttr).toEqual('2020-03-01');
  });

  it('transforms one-to-one composition', () => {
    const patch = {
      compositionO2Oattr: {
        dateAttr: moment('2020-03-01', 'YYYY-MM-DD')
      }
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.compositionO2Oattr.dateAttr).toEqual('2020-03-01');
  });

  it('transforms one-to-many composition (zero entities)', () => {
    const patch = {
      compositionO2Mattr: null
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.compositionO2Mattr).toEqual([]);
  });

  it('transforms one-to-many composition (>0 entities)', () => {
    const patch = {
      compositionO2Mattr: [
        {
          dateAttr: moment('2020-03-10', 'YYYY-MM-DD')
        },
        {
          dateAttr: moment('2020-03-11', 'YYYY-MM-DD')
        },
        {
          dateAttr: moment('2020-03-12', 'YYYY-MM-DD')
        }
      ]
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.compositionO2Mattr[0].dateAttr).toEqual('2020-03-10');
    expect(normalizedPatch.compositionO2Mattr[1].dateAttr).toEqual('2020-03-11');
    expect(normalizedPatch.compositionO2Mattr[2].dateAttr).toEqual('2020-03-12');
  });

  it('transforms one-to-one association', () => {
    const patch = {
      associationO2Oattr: '86722b66-379b-4abf-9a1f-e984637827b3'
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.associationO2Oattr).toEqual({id: '86722b66-379b-4abf-9a1f-e984637827b3'});
  });

  it('transforms many-to-many association', () => {
    const patch = {
      associationM2Mattr: [
        '86722b66-379b-4abf-9a1f-e984637827b3',
        'c6a1cee6-f562-48a0-acbe-9625e0b278b1',
        '52a7b1e4-4727-4802-9eb2-b58bce0eaf6e'
      ]
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.associationM2Mattr).toEqual([
      {id: '86722b66-379b-4abf-9a1f-e984637827b3'},
      {id: 'c6a1cee6-f562-48a0-acbe-9625e0b278b1'},
      {id: '52a7b1e4-4727-4802-9eb2-b58bce0eaf6e'}
    ]);
  });

  it('transforms many-to-one association', () => {
    const patch = {
      associationM2Oattr: '86722b66-379b-4abf-9a1f-e984637827b3'
    };
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.associationM2Oattr).toEqual({
      id: '86722b66-379b-4abf-9a1f-e984637827b3',
    });
  });

  it('handles null value', () => {
    const patch = {stringAttr: null};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.stringAttr).toEqual(null);
  });

  it('handles empty string value', () => {
    const patch = {stringAttr: ''};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.stringAttr).toEqual(null);
  });

  it('does not transform string attribute', () => {
    const patch = {stringAttr: 'some string'};
    const normalizedPatch = formFieldsToInstanceItem(patch, 'test', MOCK_METADATA);
    expect(normalizedPatch.stringAttr).toEqual('some string');
  });
});

describe('instanceItemToFormFields', () => {
  it('handles undefined item', () => {
    const fields = instanceItemToFormFields(undefined, 'test', MOCK_METADATA, ['stringAttr']);
    expect(fields).toEqual({});
  });

  it('handles undefined relation attribute values', () => {
    const item = {};
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA,[
      'compositionO2Oattr',
      'compositionO2Mattr',
      'associationO2Oattr',
      'associationM2Oattr',
      'associationM2Mattr',
    ]);
    expect(fields).toEqual(item);
  });

  it('transforms file descriptor', () => {
    const item = {
      fileDescriptorAttr: {
        id: '86722b66-379b-4abf-9a1f-e984637827b3',
        name: 'Terms and Conditions',
        extension: 'pdf'
      }
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['fileDescriptorAttr']);
    expect(fields.fileDescriptorAttr).toEqual({
      id: '86722b66-379b-4abf-9a1f-e984637827b3',
      name: 'Terms and Conditions',
    });
  });

  it('does not transform compositions', () => {
    const item = {
      compositionO2Oattr: {
        id: '86722b66-379b-4abf-9a1f-e984637827b3',
        dateAttr: '2020-03-01'
      },
      compositionO2Mattr: [
        {
          id: 'c6a1cee6-f562-48a0-acbe-9625e0b278b1',
          dateAttr: '2020-03-02'
        },
        {
          id: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76',
          dateAttr: '2020-03-03'
        },
      ],
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['compositionO2Oattr', 'compositionO2Mattr']);
    expect(fields).toEqual({
      compositionO2Oattr: {
        id: '86722b66-379b-4abf-9a1f-e984637827b3',
        dateAttr: moment('2020-03-01', 'YYYY-MM-DD')
      },
      compositionO2Mattr: [
        {
          id: 'c6a1cee6-f562-48a0-acbe-9625e0b278b1',
          dateAttr: moment('2020-03-02', 'YYYY-MM-DD')
        },
        {
          id: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76',
          dateAttr: moment('2020-03-03', 'YYYY-MM-DD')
        },
      ],
    });
  });

  it('transforms one-to-one associations', () => {
    const item = {
      associationO2Oattr: {
        id: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76',
        dateAttr: '2020-03-01'
      }
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['associationO2Oattr']);
    expect(fields).toEqual({
      associationO2Oattr: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76'
    })
  });

  it('transforms to-many associations', () => {
    const item = {
      associationO2Mattr: [
        {
          id: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76',
          dateAttr: '2020-03-01'
        },
        {
          id: '86722b66-379b-4abf-9a1f-e984637827b3',
          dateAttr: '2020-03-02'
        }
      ]
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['associationO2Mattr']);
    expect(fields).toEqual({
        associationO2Mattr: ['9b4188bf-c382-4b89-aedf-b6bcee6f2f76', '86722b66-379b-4abf-9a1f-e984637827b3']
      }
    );
  });

  it('handles null attribute value', () => {
    const item = {
      stringAttr: null
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['stringAttr']);
    expect(fields).toEqual(item);
  });

  it('transforms temporal properties', () => {
    const item = {
      dateAttr: '2020-03-01'
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['dateAttr']);
    expect(moment.isMoment(fields.dateAttr)).toBeTruthy();
    expect(fields.dateAttr.format('YYYY-MM-DD')).toEqual('2020-03-01');
  });

  it('does not transform string properties', () => {
    const item = {
      stringAttr: 'some value'
    };
    const fields = instanceItemToFormFields(item, 'test', MOCK_METADATA, ['stringAttr']);
    expect(fields).toEqual(item);
  });
});

describe('stripTemporaryIds', () => {
  it('removes temporary id', () => {
    const item = {
      stringAttr: 'some value',
      id: '_CUBA_TEMPORARY_ENTITY_ID_7283974224'
    };
    expect(stripTemporaryIds(item)).toEqual({
      stringAttr: 'some value'
    });
  });
  it('does not remove normal id', () => {
    const item = {
      stringAttr: 'some value',
      id: '9b4188bf-c382-4b89-aedf-b6bcee6f2f76'
    };
    expect(stripTemporaryIds(item)).toEqual(item);
  });
});

const MOCK_METADATA = [
  {
    entityName: 'test',
    properties: [
      {
        name: "fileDescriptorAttr",
        attributeType: "ASSOCIATION" as AttributeType,
        type: "sys$FileDescriptor",
        cardinality: "MANY_TO_ONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "stringAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "string",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: 'dateAttr',
        attributeType: 'DATATYPE' as AttributeType,
        type: 'date',
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "associationO2Oattr",
        attributeType: "ASSOCIATION" as AttributeType,
        type: "scr_AssociationO2OTestEntity",
        cardinality: "ONE_TO_ONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "associationO2Mattr",
        attributeType: "ASSOCIATION" as AttributeType,
        type: "scr_AssociationO2MTestEntity",
        cardinality: "ONE_TO_MANY" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "associationM2Mattr",
        attributeType: "ASSOCIATION" as AttributeType,
        type: "scr_AssociationM2MTestEntity",
        cardinality: "MANY_TO_MANY" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "associationM2Oattr",
        attributeType: "ASSOCIATION" as AttributeType,
        type: "scr_AssociationM2OTestEntity",
        cardinality: "MANY_TO_ONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "compositionO2Oattr",
        attributeType: "COMPOSITION" as AttributeType,
        type: "scr_CompositionO2OTestEntity",
        cardinality: "ONE_TO_ONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
      {
        name: "compositionO2Mattr",
        attributeType: "COMPOSITION" as AttributeType,
        type: "scr_CompositionO2MTestEntity",
        cardinality: "ONE_TO_MANY" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_CompositionO2OTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_CompositionO2MTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_AssociationO2OTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_AssociationO2MTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_AssociationM2OTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  },
  {
    entityName: 'scr_AssociationM2MTestEntity',
    properties: [
      {
        name: "dateAttr",
        attributeType: "DATATYPE" as AttributeType,
        type: "date",
        cardinality: "NONE" as Cardinality,
        // --
        mandatory: false,
        readOnly: false,
        description: "description",
        persistent: true,
        isTransient: false,
      },
    ]
  }
];
