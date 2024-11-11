/**
 * @module ModuleACL
 */
import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {ACLAction, ACLType} from "../interfaces/aclinterfaces";
import {modal} from "../../../services/modal.service";

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
    public activeType: ACLType = {
        acltype: undefined,
        aclactions: [],
        aclfields: []
    };
    public activeModule: string = '';

    constructor(public backend: backend, public modal: modal, public elementRef: ElementRef) {

    }

    public setType(acltype) {
        this.activeType.acltype = acltype
        this.activeType.aclfields =  [];
        this.activeType.aclactions = [];

        let awaitModal = this.modal.await('LBL_LOADING')
        this.backend.getRequest('module/SpiceACLObjects/modules/'+acltype.id).subscribe({
            next: (typedata) => {
                this.activeType.aclfields = typedata.authtypefields ? typedata.authtypefields : [];
                this.activeType.aclactions = typedata.authtypeactions;

                // sort the arrays
                this.sortType();

                // close the modal
                awaitModal.emit(true)
            },
            error: (e) => {
                awaitModal.emit(true);
            }
        });
    }



    public sortType() {
        this.activeType.aclfields.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        this.activeType.aclactions.sort((a, b) => {
            return a.action.localeCompare(b.action)
        });
    }

}
