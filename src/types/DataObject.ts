export type DataObject = {
  [key: string]: unknown;
};

export type AutocompleteAddressComponentDataObject = {
  mode: 'autocomplete';
  address: {
    [key: string]: unknown;
  };
};

export type ManualAddressComponentDataObject = {
  mode: 'manual';
  address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
};

export type AddressComponentDataObject =
  | AutocompleteAddressComponentDataObject
  | ManualAddressComponentDataObject;
