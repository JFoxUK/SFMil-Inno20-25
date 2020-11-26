import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RESOURCE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/ResourceListUpdate__c';
export default class ResourceMap extends LightningElement {
  mapMarkers = [];
  subscription = null;
  @wire(MessageContext)
  messageContext;
  connectedCallback() {
    // Subscribe to ResourceListUpdate__c message
    this.subscription = subscribe(
        this.messageContext,
        RESOURCE_LIST_UPDATE_MESSAGE,
        (message) => {
            this.handleResourceListUpdate(message);
        });
  }
  disconnectedCallback() {
    // Unsubscribe from ResourceListUpdate__c message
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  handleResourceListUpdate(message) {
    this.mapMarkers = message.resources.map(resource => {
      const Latitude = resource.Location__Latitude__s;
      const Longitude = resource.Location__Longitude__s;
      return {
        location: { Latitude, Longitude },
        title: resource.Name,
        description: `Type: ${resource.Type__c}`,
        icon: 'utility:trailhead_alt'
      };
    });
  }
}