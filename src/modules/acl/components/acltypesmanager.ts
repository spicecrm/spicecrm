/**
 * @module ModuleACL
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from "../../../services/broadcast.service";


@Component({
    templateUrl: './src/modules/acl/templates/acltypesmanager.html',
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

    constructor(private backend: backend, private modelutilities: modelutilities, private elementRef: ElementRef) {

    }

    get contentStyle() {
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        };
    }

    public setType(acltype) {
        this.activeType.authtypeid = acltype.id;
        this.activeType.authtypemodule = acltype.module;
        this.backend.getRequest('module/SpiceACLObjects/modules/'+acltype.id).subscribe(typedata => {
            this.activeType.authtypefields = typedata.authtypefields ? typedata.authtypefields : [];
            this.activeType.authtypeactions = typedata.authtypeactions;

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
        this.backend.postRequest('module/SpiceACLObjects/modules/'+this.activeType.authtypeid+'/actions/'+action).subscribe(actiondata => {
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

    private sortType() {
        this.activeType.authtypefields.sort((a, b) => {
            return a.name > b.name;
        });
        this.activeType.authtypeactions.sort((a, b) => {
            return a.action > b.action;
        });
    }

}
