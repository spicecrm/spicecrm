/**
 * @module ModuleSalesDocs
 */
import {
    Component, EventEmitter, Input,  Output
} from '@angular/core';



/**
 * preview a new OutPut
 */
@Component({
    selector: 'outputrevisions-pdf-tab-container-preview',
    templateUrl: '../templates/outputrevisionspdftabcontainerpreview.html'
})
export class OutputRevisionsPDFTabContainerPreview {


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

    constructor() {
    }

    /**
     * handles closing the modal
     */
    public closeModal(save = false) {
        this.save$.emit(save);
        this.self.destroy();
    }


}
