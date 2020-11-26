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
        Military_Resource__c[] resourceArr = ResourceController.searchResources('Test');

        System.assertEquals(50, resourceArr.size());
        System.assert(resourceArr[0].Name.contains('Test'));
    }
}
