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
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjects.html',
})
export class ACLObjectsManagerObjects {

    @ViewChild('header', {read: ViewContainerRef, static: true}) header: ViewContainerRef;

    loading: boolean = false;

    acltypes: Array<any> = [];
    activeTypeId: String = '';

    aclobjects: Array<any> = [];
    activeObjectId: String = '';
    searchterm: String = '';

    @Output() objectselected: EventEmitter<any> = new EventEmitter<any>();
    @Output() typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language) {

        this.backend.getRequest('spiceaclobjects/authtypes').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            })
        })


    }

    private keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    private getObjects() {
        this.loading = true;
        this.aclobjects = [];

        let params = {
            spiceacltype_id: this.activeTypeId,
            searchterm: this.searchterm
        }

        this.backend.getRequest('spiceaclobjects', params).subscribe(aclobjects => {
            this.aclobjects = aclobjects;

            this.aclobjects.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            })
            this.loading = false;
        })
    }

    get contentStyle() {
        let rect = this.header.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

    private getType(type) {
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    private selectType(event) {
        this.getObjects();

        // reset the selected object
        this.activeObjectId = '';
        this.objectselected.emit(this.activeObjectId);

        // emit the type
        this.typeselected.emit(this.activeTypeId);
    }

    private addObject() {
        this.modal.openModal('ACLObjectsManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.spiceacltype_id = this.activeTypeId;
            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclobjects.push(modelData);
                    this.selectObject(modelData);
                }
            });
        });
    }

    private selectObject(aclobject) {
        this.activeObjectId = aclobject.id;

        this.objectselected.emit(this.activeObjectId);
    }

    private activateObject(objectid) {
        this.backend.postRequest('spiceaclobjects/activation/' + objectid).subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'r';
                    return true;
                }
            })
        })
    }

    private deactivateObject(objectid) {
        this.backend.deleteRequest('spiceaclobjects/activation/' + objectid).subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'd';
                    return true;
                }
            })
        })
    }

}