/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {configurationService} from '../../services/configuration.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-companies',
    templateUrl: './src/objectfields/templates/fieldcompanies.html'
})
export class fieldCompanies extends fieldGeneric implements OnInit{

    companies: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private configurationService: configurationService) {
        super(model, view, language, metadata, router);
    }

    ngOnInit(){
        let storedCompanies = this.configurationService.getData('companies');
        if(storedCompanies === false){
            this.backend.getRequest('module/CompanyCodes').subscribe((companies : any) => {
                this.configurationService.setData('companies', companies.list);
                this.companies = companies.list;
                this.setDefault();
            })
        } else {
            this.companies = storedCompanies;
            this.setDefault();
        }
    }

    setDefault(){
        if(this.view.isEditMode() && !this.model.data[this.fieldname] && this.companies.length > 0){
            this.value = this.companies[0].id;
        }
    }

    get companyName(){
        let companyName = '';
        this.companies.some(company => {
            if(company.id == this.model.data[this.fieldname]){
                companyName = company.name;
                return true;
            }
        })
        return companyName;

    }
}