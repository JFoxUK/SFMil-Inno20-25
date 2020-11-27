@isTest(seeAllData=false)
public with sharing class ResourceControllerTest {
   
    @TestSetup
    static void createData(){
        List<Military_Resource__c> testMilitary_Resource = new List<Military_Resource__c>();
        for(Integer i = 0; i<60; i++){

            Military_Resource__c resource = new Military_Resource__c(
                Name = 'Test ' + i,
                Type__c = 'Person',
                Email__c = 'Test@test.com',
                Phone__c = '+447304938474',
                Website__c = 'www.website.com',
                Country__c = 'United Kingdom',
                Location__Latitude__s = 53.267222,
                Location__Longitude__s = -1.269426
            );
            testMilitary_Resource.add(resource);
        }
        insert testMilitary_Resource;
    }

    @isTest
    static void testGetResources(){
        Military_Resource__c[] resourceArr = ResourceController.getAllResources();

        System.assertEquals(50, resourceArr.size());
    }

    @isTest
    static void testGetResourcesSearch(){
        Military_Resource__c[] resourceArr = ResourceController.searchResources('Test' , '', '');

        System.assertEquals(50, resourceArr.size());
        System.assert(resourceArr[0].Name.contains('Test'));
    }

    @isTest
    static void testGetResourcesSearchType(){
        Military_Resource__c[] resourceArr = ResourceController.searchResources('' , 'Person', '');

        System.assertEquals(50, resourceArr.size());
        System.assert(resourceArr[0].Type__c.contains('Person'));
    }
    @isTest
    static void testGetResourcesSearchCountry(){
        Military_Resource__c[] resourceArr = ResourceController.searchResources('' , '', 'United Kingdom');

        System.assertEquals(50, resourceArr.size());
        System.assert(resourceArr[0].Country__c.contains('United Kingdom'));
    }
    @isTest
    static void testGetResourcesSearchAll(){
        Military_Resource__c[] resourceArr = ResourceController.searchResources('' , '', '');

        System.assertEquals(50, resourceArr.size());
    }
}
