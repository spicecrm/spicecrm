/**
 * @module ModuleACL
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-objects',
    templateUrl: '../templates/aclobjectsmanagerobjects.html',
})
export class ACLObjectsManagerObjects {

    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    public loading: boolean = false;
    public acltypes: any[] = [];
    public activeTypeId: string = '';
    public aclobjects: any[] = [];
    public activeObjectId: string = '';
    public searchterm: string = '';

    @Output() public objectselected: EventEmitter<any> = new EventEmitter<any>();
    @Output() public typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public modal: modal, public language: language) {

        this.backend.getRequest('module/SpiceACLObjects/modules').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            });
        });


    }

    public keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    public getObjects() {
        this.loading = true;
        this.aclobjects = [];

        let params = {
            moduleid: this.activeTypeId,
            searchterm: this.searchterm
        };

        this.backend.getRequest('module/SpiceACLObjects', params).subscribe(aclobjects => {
            this.aclobjects = aclobjects;
            this.aclobjects.sort((a, b) =>  a.name.localeCompare(b.name));
            this.loading = false;
        });
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

    public selectType(event) {
        this.getObjects();

        // reset the selected object
        this.activeObjectId = '';
        this.objectselected.emit(this.activeObjectId);

        // emit the type
        this.typeselected.emit(this.activeTypeId);
    }

    public addObject() {
        this.modal.openModal('ACLObjectsManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.sysmodule_id = this.activeTypeId;
            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclobjects.push(modelData);
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
        if(this.aclobjects.length == 0 && this.activeTypeId) {
            this.loading = true;

            let body = {
                moduleid: this.activeTypeId,
                modulename: this.acltypes.find(x => x.id == this.activeTypeId).module
            };
            this.backend.postRequest('module/SpiceACLObjects/defaultobjects', {}, body).subscribe(aclobjects => {
                this.getObjects();
                this.loading = false;
            });
        }
    }

    /**
     *
     * @param aclobject
     * @private
     */
    public selectObject(aclobject) {
        this.activeObjectId = aclobject.id;
        this.objectselected.emit(this.activeObjectId);
    }

    /**
     * activate the acl object
     * @param objectid
     * @private
     */
    public activateObject(objectid) {
        this.backend.postRequest('module/SpiceACLObjects/' + objectid + '/activation').subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'r';
                    return true;
                }
            });
        });
    }

    /**
     * deactivate the acl object
     * @param objectid
     * @private
     */
    public deactivateObject(objectid) {
        this.backend.deleteRequest('module/SpiceACLObjects/' + objectid + '/activation').subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'd';
                    return true;
                }
            });
        });
    }
}
