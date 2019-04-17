/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'dictionarymanager-item-domain',
    templateUrl: './src/workbench/templates/dictionarymanageritemdomain.html'
})
export class DictionaryManagerItemDomain{

    @Input() entry: any = {};
    @Input() field: any = {};
    @Input() domains: any = {};

    constructor(private view: view) {
    }

    get domainname(){
        let domainname: string = '';

        this.domains.some(domain => {
            if(domain.id == this.entry[this.field.name]){
                domainname = domain.name;
                return true;
            }
        })

        return domainname;
    }

    set domainname(value){
        // do nothing
    }

    isEditMode(){
        return this.view.isEditMode();
    }

    getDomainArray(){
        let domainArray = [];
        for(let domain of this.domains){
            domainArray.push({
                id: domain.id,
                name: domain.name
            })
        }
        return domainArray;
    }

}