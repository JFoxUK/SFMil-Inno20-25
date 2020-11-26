import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
// Set Resource object fields
const NAME_FIELD = 'Military_Resource__c.Name';
const LOCATION_LATITUDE_FIELD = 'Military_Resource__c.Location__Latitude__s';
const LOCATION_LONGITUDE_FIELD = 'Military_Resource__c.Location__Longitude__s';
const resourceFields = [
	NAME_FIELD,
	LOCATION_LATITUDE_FIELD,
	LOCATION_LONGITUDE_FIELD
];
export default class ResourceLocation extends LightningElement {
  @api recordId;
  name;
  mapMarkers = [];
  @wire(getRecord, { recordId: '$recordId', fields: resourceFields })
  loadResource({ error, data }) {
    if (error) {
      // TODO: handle error
    } else if (data) {
      // Get Resource data
      this.name =  getFieldValue(data, NAME_FIELD);
      const Latitude = getFieldValue(data, LOCATION_LATITUDE_FIELD);
      const Longitude = getFieldValue(data, LOCATION_LONGITUDE_FIELD);
      // Transform resource data into map markers
      this.mapMarkers = [{
        location: { Latitude, Longitude },
        title: this.name,
        description: `Type: ${resource.Type__c}`,
      }];
    }
  }
  get cardTitle() {
    return (this.name) ? `${this.name}'s location` : 'Resource location';
  }
}