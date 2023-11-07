using app.interactions from '../db/interactions-model';
using {GW_SAMPLE_BASIC as external} from './external/GW_SAMPLE_BASIC';
using {API_BUSINESS_PARTNER as external_BP} from './external/API_BUSINESS_PARTNER';

// @requires: 'authenticated-user'
@path:'/catalog'
service CatalogService {
    entity Interactions_Header as projection on interactions.Interactions_Header;
    entity Interactions_Items  as projection on interactions.Interactions_Items;

    // @cds.persistence.skip
    @readonly
    entity BusinessPartners    as projection on external.BusinessPartnerSet excluding { Address };

    @readonly
    entity API_BP              as projection on external_BP.A_BusinessPartner { 
        BusinessPartner, Customer, Supplier, AcademicTitle, AuthorizationGroup, BusinessPartnerCategory, BusinessPartnerFullName,
        BusinessPartnerGrouping, BusinessPartnerName
    };
 
    @requires: 'authenticated-user'
    // action submitItem(INTHeader: Interactions_Items:INTHeader, TextID: Interactions_Items:TEXT_ID, TextVal: Interactions_Items:LOGTEXT, Lang: Interactions_Items:LANGU) returns {
        action submitItem(HeaderID: Integer, TextID: Integer, TextVal: String, Lang: String) returns {
        inserted : Boolean
    };

    @cds.persistence.skip
    @readonly
    entity UserInfo {
        key userName : String(30);
            role     : Boolean;
            storeID  : String(4);
    }
}
