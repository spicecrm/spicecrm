/**
 * @module ModuleSalesDocs
 */
import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SalesDocsPDFTabContainerEmail} from "./salesdocspdftabcontaineremail";
import {DomSanitizer} from "@angular/platform-browser";

declare var moment: any

/**
 * preview a new OutPut
 */
@Component({
    selector: 'salesdocs-pdf-tab-container-preview',
    templateUrl: '../templates/salesdocpdftabcontainerpreview.html'
})
export class SalesDocsPDFTabContainerPreview {


    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the type of the object that will be passed in
     */
    @Input() public type: string = '';

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() public name: string = '';

    /**
     * can be set to true to display a page not available error
     *
     * @private
     */
    @Input() public loadingerror: boolean = false;

    /**
     * holds data input sent by trigger
     */
    @Input() public data: any;

    /**
     * to emit when we shoudl save
     */
    @Output() public save$: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language) {
    }

    /**
     * handles closing the modal
     */
    public closeModal(save = false) {
        this.save$.emit(save);
        this.self.destroy();
    }


}
