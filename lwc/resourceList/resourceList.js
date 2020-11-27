import { LightningElement, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Military_Resource_OBJECT from '@salesforce/schema/Military_Resource__c';
import TYPE_FIELD from '@salesforce/schema/Military_Resource__c.Type__c';
import COUNTRY_FIELD from '@salesforce/schema/Military_Resource__c.Country__c';
import RESOURCE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/ResourceListUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import searchResources from '@salesforce/apex/ResourceController.searchResources';

export default class ResourceList extends NavigationMixin(LightningElement) {
	
	resources;
	searchTerm = '';
	searchFilterType = '';
	@track searchFilterTypeOptions = [];
	searchFilterCountry = '';
	@track searchFilterCountryOptions = [];

    @wire(getObjectInfo, { objectApiName: Military_Resource_OBJECT })
    Military_ResourceInfo;

    @wire(getPicklistValues,{recordTypeId: '$Military_ResourceInfo.data.defaultRecordTypeId', fieldApiName: TYPE_FIELD})
	typeValues({error, data}){
		if(data){
			let mappedItems = [];
			data.values.map(result => {
				mappedItems.push({label: result.label, value: result.value});
				
			})
			this.searchFilterTypeOptions = mappedItems;
			
			
		}else if(error){
			console.log(error);
		}
	}
	@wire(getPicklistValues,{recordTypeId: '$Military_ResourceInfo.data.defaultRecordTypeId', fieldApiName: COUNTRY_FIELD})
	countryValues({error, data}){
		if(data){
			let countryMappedItems = [];
			data.values.map(result => {
				countryMappedItems.push({label: result.label, value: result.value});
				
			})
			this.searchFilterCountryOptions = countryMappedItems;
			
			
		}else if(error){
			console.log(error);
		}
	}
   
	@wire(MessageContext) messageContext;
	@wire(searchResources, {searchTerm: '$searchTerm', searchFilterType: '$searchFilterType', searchFilterCountry: '$searchFilterCountry'})
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

	handleTypeChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchFilterType = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchFilterType = searchFilterType;
		}, 300);
	}
	clearFilters(){
		this.searchFilterType = '';
		this.searchTerm = '';
		this.searchFilterCountry = '';
	}
	
	handleCountryChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchFilterCountry = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchFilterCountry = searchFilterCountry;
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