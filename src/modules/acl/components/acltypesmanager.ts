/**
 * @module ModuleACL
 */
import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';

/**
 * renders theACL types Manager as part of the admin section
 */
@Component({
    selector: 'acl-types-manager',
    templateUrl: '../templates/acltypesmanager.html',
})
export class ACLTypesManager {

    @ViewChild('managercontent', {read: ViewContainerRef, static: true})

    public elementmanagercontent: ViewContainerRef;
    public activeType: any = {
        authtypeid: '',
        authtypemodule: '',
        authtypefields: {},
        authtypeactions:[]
    };
    public activeModule: string = '';

    constructor(public backend: backend, public modelutilities: modelutilities, public elementRef: ElementRef) {

    }

    public setType(acltype) {
        this.activeType.authtypeid = acltype.id;
        this.activeType.authtypemodule = acltype.module;
        this.backend.getRequest('module/SpiceACLObjects/modules/'+acltype.id).subscribe(typedata => {
            this.activeType.authtypefields = typedata.authtypefields ? typedata.authtypefields : [];
            this.activeType.authtypeactions = typedata.authtypeactions;

            // sort the actions
            this.activeType.authtypeactions.sort((a, b)=> a.action.localeCompare(b.action));

            // sort the arrays
            this.sortType();
        });
    }

    public addFields(fields) {
        for (let field of fields) {
            this.backend.postRequest('module/SpiceACLObjects/modules/' + this.activeType.authtypeid + '/fields/' + field).subscribe(fielddata => {
                this.activeType.authtypefields.push(fielddata);
                this.sortType();
            });
        }
    }

    public deleteField(fieldid) {
        this.backend.deleteRequest('module/SpiceACLObjects/modules/' + this.activeType.authtypeid + '/fields/' + fieldid).subscribe(fielddata => {
            this.activeType.authtypefields.some((field, index) => {
                if (field.id == fieldid) {
                    this.activeType.authtypefields.splice(index, 1);
                    return true;
                }
            });
        });
    }

    public addAction(action) {
        this.backend.postRequest('module/SpiceACLObjects/modules/'+this.activeType.authtypeid+'/actions/'+action.action, {}, {description: action.description}).subscribe(actiondata => {
            this.activeType.authtypeactions.push(actiondata);
            this.sortType();
        });
    }

    public deleteAction(actionid) {
        this.backend.deleteRequest('module/SpiceACLObjects/modules/'+this.activeType.authtypeid+'/actions/'+actionid).subscribe(fielddata => {
            this.activeType.authtypeactions.some((action, index) => {
                if(action.id == actionid) {
                    this.activeType.authtypeactions.splice(index, 1);
                    return true;
                }
            });
        });
    }

    public sortType() {
        this.activeType.authtypefields.sort((a, b) => {
            return a.name > b.name;
        });
        this.activeType.authtypeactions.sort((a, b) => {
            return a.action > b.action ? 1 : -1;
        });
    }

}
