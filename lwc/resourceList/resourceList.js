import { publish, MessageContext } from 'lightning/messageService';
import RESOURCE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/ResourceListUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, wire } from 'lwc';
/** ResourceController.searchResources(searchTerm) Apex method */
import searchResources from '@salesforce/apex/ResourceController.searchResources';
export default class ResourceList extends NavigationMixin(LightningElement) {
	searchTerm = '';
	resources;
	@wire(MessageContext) messageContext;
	@wire(searchResources, {searchTerm: '$searchTerm'})
	loadResources(result) {
		this.resources = result;
		if (result.data) {
			const message = {
				resources: result.data
			};
			publish(this.messageContext, RESOURCE_LIST_UPDATE_MESSAGE, message);
		}
	}
	handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.resources.data.length > 0);
	}
	handleResourceView(event) {
		// Get resource record id from resourceview event
		const resourceId = event.detail;
		// Navigate to resource record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: resourceId,
				objectApiName: 'Military_Resource__c',
				actionName: 'view',
			},
		});
	}
}