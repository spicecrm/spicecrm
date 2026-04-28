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
    OnChanges, output, signal
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    templateUrl: '../templates/aclprofilesmanageraddobjectmodal.html',
    providers: [model],
    standalone: false
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
    /**
     * output for selected objects
     */
    public selectedObjects$ = output<any[]>();
    /**
     * holds the selected objects
     */
    public selectedObjects = signal<any[]>([]);

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

    /**
     * select an object
     * @param aclobject
     */
    public selectObject(aclobject) {
        if (this.selectedObjects().some(o => o.id == aclobject.id)) {
            return;
        }

        aclobject.module = this.currentModule;
        this.selectedObjects.set(
            [...this.selectedObjects(), aclobject]
        );
    }

    /**
     * remove an object from the selected objects
     */
    public removeObject(id: string) {
        this.selectedObjects.set(
            this.selectedObjects().filter(o => o.id != id)
        );
    }

    public close() {
        this.self.destroy();
    }

    public save() {
        this.selectedObjects$.emit(this.selectedObjects());
        this.close();
    }
}
