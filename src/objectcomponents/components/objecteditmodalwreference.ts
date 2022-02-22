/**
 * @module ObjectComponents
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef, EventEmitter
} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    templateUrl: '../templates/objecteditmodalwreference.html',
    providers: [model, view]
})
export class ObjectEditModalWReference {
    @ViewChild('modalContent', {read: ViewContainerRef, static: true}) modalContent: ViewContainerRef;
    componentRefs: any[] = [];
    componentSet: string = '';
    module: string = '';
    reference: string = '';
    showDuplicates: boolean = false;

    doDuplicateCheck: boolean = true;
    duplicates: any[] = [];

    modalAction$: EventEmitter<any> = new EventEmitter<any>();

    self: any = {};

    constructor(public router: Router, public language: language, public model: model, public view: view, public metadata: metadata, public elementref: ElementRef) {
        this.view.isEditable = true;
        this.view.setEditMode();

    }

    closeModal() {
        this.modalAction$.emit(false);
    }

    get modalHeader(){
        return this.model.module != '' ? this.language.getModuleName(this.model.module, true) : '';
    }

    save(goDetail: boolean = false) {
        if (this.model.validate()) {
            this.modalAction$.emit(this.model.data);
        }
    }


    /*
     style function to prevent overflow to display scrollbar when duplicate check is displayed
     */
    get contentStyle() {
        if (this.showDuplicates) {
            return {
                'overflow-y': 'hidden'
            }
        }
    }
}
