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
    EventEmitter,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    templateUrl: '../templates/aclprofilesmanageraddobjectmodal.html',
    providers: [model]
})
export class ACLProfilesManagerAddObjectModal {

    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    public self: any = {};
    public acltypes: any[] = [];
    public aclobjects: any[] = [];
    public activeTypeId: string = '';
    public activeObjectId: string = '';
    public searchterm: string = '';
    public loading: boolean = false;

    @Output() public aclobject: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public backend: backend) {
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

            this.aclobjects.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
            this.loading = false;
        });
    }

    public getType(type) {
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    public selectType(event) {
        this.getObjects();
        this.activeObjectId = '';
    }

    get currentModule() {
        for(let acltype of this.acltypes) {
            if(acltype.id == this.activeTypeId) {
                return acltype.module;
            }
        }

        return '';
    }

    public selectObject(aclobject) {

        aclobject.module = this.currentModule;
        this.aclobject.emit(aclobject);
        this.close();
    }

    public close() {
        this.self.destroy();
    }

}
