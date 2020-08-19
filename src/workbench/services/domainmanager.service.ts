/**
 * @module WorkbenchModule
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';

@Injectable()
export class domainmanager {

    /**
     * the loaded list of domains
     */
    public domaindefinitions: any[] = [];

    /**
     * the loaded domain fields
     */
    public domainfields: any[] = [];

    /**
     * the loaded domain field validations
     */
    public domainfieldvalidations: any[] = [];

    /**
     * the loaded domain field validation values
     */
    public domainfieldvalidationvalues: any[] = [];

    /**
     * the currently seleted domain element
     */
    private currentDomainDefinition: string;

    /**
     * the urrently selected domain field
     */
    private currentDomainField: string;

    constructor(private backend: backend) {
        this.loadDomains();
    }

    /**
     * load the domains
     */
    private loadDomains() {
        this.backend.getRequest('system/dictionary/domains').subscribe(res => {
            this.domaindefinitions = res.domaindefinitions;
            this.domainfields = res.domainfields;
            this.domainfieldvalidations = res.domainfieldvalidations;
            this.domainfieldvalidationvalues = res.domainfieldvalidationvalues;
        });
    }

    /**
     * fina  validatzion by ID and return the record
     * @param validationid
     */
    public getValidationById(validationid) {
        return this.domainfieldvalidations.find(v => v.id == validationid);
    }


    /**
     * returns validation values filtered by validationid
     *
     * @param validationid
     */
    public getValdiationValuesdById(validationid) {
        return this.domainfieldvalidationvalues.filter(v => v.sysdomainfieldvalidation_id == validationid);
    }
}
