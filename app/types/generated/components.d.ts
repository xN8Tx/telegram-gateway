import type { Schema, Struct } from '@strapi/strapi';

export interface SharedField extends Struct.ComponentSchema {
  collectionName: 'components_shared_fields';
  info: {
    displayName: 'field';
    icon: 'bulletList';
  };
  attributes: {
    isRequired: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['string', 'number', 'stringArray', 'numberArray']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'string'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.field': SharedField;
    }
  }
}
