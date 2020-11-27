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
    public static Military_Resource__c[] searchResources(String searchTerm, String searchFilterType, String searchFilterCountry) {
        // Return all Resources when no search term
        System.debug(searchTerm + searchFilterType + searchFilterCountry);
        searchTerm = searchTerm.trim();
        searchFilterType = searchFilterType.trim();
        searchFilterCountry = searchFilterCountry.trim();

        if (searchTerm == '' && searchFilterType == '' && searchFilterCountry == '') {
            return getAllResources();
        }

        Integer conditions = 0;

        String whereClause = 'WHERE ';
        String likeClause = 'LIKE ';
        String andClause = 'AND ';


        
        String query = 'SELECT Id, Name, Type__c, Email__c, Phone__c, Website__c, Country__c, Location__Latitude__s, Location__Longitude__s FROM Military_Resource__c ';

        if(searchTerm != '' || searchFilterType != '' || searchFilterCountry != ''){
            query = query + whereClause;
        }

        if(searchTerm != ''){
            conditions += 1;
            query = query + 'Name LIKE \'%' + searchTerm + '%\'';
            
        }
        if(searchFilterType != ''){
            if(conditions > 0){
                query = query + ' ' + andClause + 'Type__c = \'' + searchFilterType + '\'';
            }else{
                query = query + 'Type__c = \'' + searchFilterType + '\'';
            }
            conditions += 1;
        }
        if(searchFilterCountry != ''){
            if(conditions > 0){
                query = query + ' ' + andClause + 'Country__c = \'' + searchFilterCountry + '\'';
            }else{
                query = query + 'Country__c = \'' + searchFilterCountry + '\'';
            }
            conditions += 1;
        }
        if(conditions > 0){
            query = query = query + ' ' + 'AND Active__c = true ORDER BY Name LIMIT 50';
        }else{
            query = query + 'Active__c = true ORDER BY Name LIMIT 50';
        }

        System.debug(query);
        return Database.query(query);
    }
    
}