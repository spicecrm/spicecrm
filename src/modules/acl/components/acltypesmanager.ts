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

    @ViewChild('managercontent', {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;
    activeType: any = {
        authtypeid: '',
        authtypemodule: '',
        authtypefields: {},
        authtypeactions:[]
    };
    activeModule: string = '';

    constructor(private backend: backend, private modelutilities: modelutilities, private elementRef: ElementRef) {

    }

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        }
    }

    setType(acltype){
        this.activeType.authtypeid = acltype.id
        this.activeType.authtypemodule = acltype.module
        this.backend.getRequest('spiceaclobjects/authtypes/'+acltype.id).subscribe(typedata => {
            this.activeType.authtypefields = typedata.authtypefields ? typedata.authtypefields : [];
            this.activeType.authtypeactions = typedata.authtypeactions;

            // sort the arrays
            this.sortType();
        });
    }

    addFields(fields){
        for (let field of fields) {
            this.backend.postRequest('spiceaclobjects/authtypes/' + this.activeType.authtypeid + '/authtypefields/' + field).subscribe(fielddata => {
                this.activeType.authtypefields.push(fielddata)
                this.sortType();
            });
        }
    }
    deleteField(fieldid) {
        this.backend.deleteRequest('spiceaclobjects/authtypes/' + this.activeType.authtypeid + '/authtypefields/' + fieldid).subscribe(fielddata => {
            this.activeType.authtypefields.some((field, index) => {
                if (field.id == fieldid) {
                    this.activeType.authtypefields.splice(index, 1);
                    return true;
                }
            })
        })
    }
    addAction(action){
        this.backend.postRequest('spiceaclobjects/authtypes/'+this.activeType.authtypeid+'/authtypeactions/'+action).subscribe(actiondata => {
            this.activeType.authtypeactions.push(actiondata)
            this.sortType();
        })
    }
    deleteAction(actionid){
        this.backend.deleteRequest('spiceaclobjects/authtypes/'+this.activeType.authtypeid+'/authtypeactions/'+actionid).subscribe(fielddata => {
            this.activeType.authtypeactions.some((action, index) => {
                if(action.id == actionid){
                    this.activeType.authtypeactions.splice(index, 1);
                    return true;
                }
            })
        })
    }

    private sortType(){
        this.activeType.authtypefields.sort((a, b) => {
            return a.name > b.name;
        })
        this.activeType.authtypeactions.sort((a, b) => {
            return a.action > b.action;
        })
    }

}