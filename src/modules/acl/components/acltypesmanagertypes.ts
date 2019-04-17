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

    @ViewChild('header', {read: ViewContainerRef}) header: ViewContainerRef;

    loading: boolean = true;

    acltypes: Array<any> = [];
    activeTypeId: string = '';

    @Output() typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.backend.getRequest('spiceaclobjects/authtypes').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            })

            this.loading = false;
        })
    }

    selectType(acltype){
        this.activeTypeId = acltype.id;
        this.typeselected.emit(acltype);
    }

    get contentStyle(){
        let rect = this.header.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

}