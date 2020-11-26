public with sharing class ResourceController {
    @AuraEnabled(Cacheable=true)
    public static Military_Resource__c[] getAllResources() {
        return [
            SELECT
                Id,
                Name,
                Type__c,
                Email__c,
                Phone__c,
                Website__c,
                Location__Latitude__s,
                Location__Longitude__s
            FROM Military_Resource__c
            WHERE Active__c = True
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled(Cacheable=true)
    public static Military_Resource__c[] searchResources(String searchTerm) {
        // Return all Resources when no search term
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getAllResources();
        }
        // Prepare query paramters
        searchTerm = '%' + searchTerm + '%';
        // Execute search query
        return [
            SELECT
                Id,
                Name,
                Type__c,
                Email__c,
                Phone__c,
                Website__c,
                Location__Latitude__s,
                Location__Longitude__s
            FROM Military_Resource__c
            WHERE Name LIKE :searchTerm
            AND Active__c = True
            ORDER BY Name
            LIMIT 50
        ];
    }
}