/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {aclobjectsmanager} from "../services/aclobjectsmanager.service";

@Component({
    selector: 'aclobjects-manager-objects',
    templateUrl: '../templates/aclobjectsmanagerobjects.html',
})
export class ACLObjectsManagerObjects {

    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    public loading: boolean = false;

    public searchterm: string = '';


    /**
     * listener for updated acl object from child
     */
    @Output() public objectUpdated: EventEmitter<any> = new EventEmitter<any>(); // Emit updated object

    constructor(public aclobjectsmanager: aclobjectsmanager, public backend: backend, public modal: modal, public language: language) {


    }

    public keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    public getObjects() {
        this.aclobjectsmanager.aclobjects = [];

        if(this.aclobjectsmanager.activeTypeId) {
            this.loading = true;
            this.backend.getRequest('module/SpiceACLObjects', {
                moduleid: this.aclobjectsmanager.activeTypeId,
                searchterm: this.searchterm
            }).subscribe({
                next: (aclobjects) => {
                    this.aclobjectsmanager.aclobjects = aclobjects;
                    this.aclobjectsmanager.aclobjects.sort((a, b) => a.name.localeCompare(b.name));
                    this.loading = false;
                }
            });
        }
    }

    get module(){
        return this.aclobjectsmanager.activeTypeId ? this.aclobjectsmanager.acltypes.find(t => t.id == this.aclobjectsmanager.activeTypeId).module : undefined;
    }

    set module(module){
        this.aclobjectsmanager.activeTypeId = module ? this.aclobjectsmanager.acltypes.find(t => t.module == module).id : undefined;
        this.selectType()
    }

    get contentStyle() {
        let rect = this.header.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        };
    }

    public getType(type) {
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    public selectType() {
        this.getObjects();

        // reset the selected object
        this.aclobjectsmanager.activeObjectId = '';
    }

    public addObject() {
        this.modal.openModal('ACLObjectsManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.sysmodule_id = this.aclobjectsmanager.activeTypeId;
            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclobjectsmanager.aclobjects.push(modelData);
                    this.selectObject(modelData);
                }
            });
        });
    }

    /**
     * add default ACL objects to module
     * @private
     */
    public addDefaultObjects() {
        if(this.aclobjectsmanager.aclobjects.length == 0 && this.aclobjectsmanager.activeTypeId) {
            this.loading = true;

            let body = {
                moduleid: this.aclobjectsmanager.activeTypeId,
                modulename: this.aclobjectsmanager.acltypes.find(x => x.id == this.aclobjectsmanager.activeTypeId).module
            };
            this.backend.postRequest('module/SpiceACLObjects/defaultobjects', {}, body).subscribe({
                next: (aclobjects) => {
                    this.getObjects();
                    this.loading = false;
                }
            });
        }
    }

    /**
     *
     * @param aclobject
     * @private
     */
    public selectObject(aclobject) {
        this.aclobjectsmanager.activeObjectId = aclobject.id;
    }
}
