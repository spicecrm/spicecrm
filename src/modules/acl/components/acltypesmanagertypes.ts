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
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypes.html',
})
export class ACLTypesManagerTypes {

    /**
     * inicates that we are loading
     */
    public loading: boolean = true;

    /**
     * the list of acl types
     */
    public acltypes: any[] = [];

    /**
     * the active type id
     */
    public activeTypeId: string = '';

    /**
     * a filter for the module
     *
     * @private
     */
    private filter: string;

    /**
     * an output when the type is selected
     */
    @Output() public typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.backend.getRequest('module/SpiceACLObjects/modules').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            });

            this.loading = false;
        });
    }

    /**
     * returns a filtered list of acl types
     */
    get acltypeslist(){
        if(!this.filter) return this.acltypes;

        return this.acltypes.filter(t => t.id == this.activeTypeId ||  t.module.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0);
    }

    /**
     * selects a type
     *
     * @param acltype
     */
    public selectType(acltype) {
        this.activeTypeId = acltype.id;
        this.typeselected.emit(acltype);
    }

}
