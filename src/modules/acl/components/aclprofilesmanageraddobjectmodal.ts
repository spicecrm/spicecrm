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
    templateUrl: './src/modules/acl/templates/aclprofilesmanageraddobjectmodal.html',
    providers: [model]
})
export class ACLProfilesManagerAddObjectModal {

    @ViewChild('header', {read: ViewContainerRef, static: true}) header: ViewContainerRef;

    self: any = {};
    acltypes: Array<any> = [];
    aclobjects: Array<any> = [];
    activeTypeId: string = '';
    activeObjectId: string = '';
    searchterm: string = '';
    loading: boolean = false;

    @Output() aclobject: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private backend: backend) {
        this.backend.getRequest('spiceaclobjects/authtypes').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            })
        })
    }

    keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    getObjects() {
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

    getType(type){
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    selectType(event) {
        this.getObjects();
        this.activeObjectId = '';
    }

    get currentModule(){
        for(let acltype of this.acltypes){
            if(acltype.id == this.activeTypeId)
                return acltype.module;
        }

        return '';
    }

    selectObject(aclobject){

        aclobject.spiceacltype_module = this.currentModule;
        this.aclobject.emit(aclobject);
        this.close();
    }

    close() {
        this.self.destroy();
    }

}