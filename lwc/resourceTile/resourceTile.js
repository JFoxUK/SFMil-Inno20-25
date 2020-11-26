import { LightningElement, api, track } from 'lwc';
import sfMilResources from '@salesforce/resourceUrl/sfmil';
export default class ResourceTile extends LightningElement {
    @api resource;
    
	appResources = {
		resourceMilAstro: `${sfMilResources}/img/astro.png`,
    };
    handleOpenRecordClick() {
        const selectEvent = new CustomEvent('resourceview', {
            detail: this.resource.Id
        });
        this.dispatchEvent(selectEvent);
    }
}