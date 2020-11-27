import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Set Resource object fields
const NAME_FIELD = 'Military_Resource__c.Name';
const LOCATION_LATITUDE_FIELD = 'Military_Resource__c.Location__Latitude__s';
const LOCATION_LONGITUDE_FIELD = 'Military_Resource__c.Location__Longitude__s';
const TYPE_FIELD = 'Military_Resource__c.Type__c';
const resourceFields = [
	NAME_FIELD,
	LOCATION_LATITUDE_FIELD,
  LOCATION_LONGITUDE_FIELD,
  TYPE_FIELD
];
export default class ResourceLocation extends LightningElement {
  @api recordId;
  name;
  mapMarkers = [];
  @wire(getRecord, { recordId: '$recordId', fields: resourceFields })
  loadResource({ error, data }) {
    if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error Reciving Map Location',
            message: 'Error reciving map marker - ' + error.body.message,
            variant: 'error',
        }),
    );
    } else if (data) {
      // Get Resource data
      this.name =  getFieldValue(data, NAME_FIELD);
      const Latitude = getFieldValue(data, LOCATION_LATITUDE_FIELD);
      const Longitude = getFieldValue(data, LOCATION_LONGITUDE_FIELD);
      const Type = getFieldValue(data, TYPE_FIELD);
      // Transform resource data into map markers
      this.mapMarkers = [{
        location: { Latitude, Longitude },
        title: this.name,
        description: Type
      }];
    }
  }
  get cardTitle() {
    return (this.name) ? `${this.name}'s location` : 'Resource location';
  }
}