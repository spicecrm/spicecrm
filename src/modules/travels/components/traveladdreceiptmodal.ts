/**
 * @module ModuleTravels
 */
import {
    AfterContentChecked,
    AfterRenderPhase,
    AfterRenderRef,
    AfterViewInit,
    Component,
    ElementRef, EventEmitter, Optional,
    ViewChild
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {SystemInputMedia} from "../../../systemcomponents/components/systeminputmedia";
import {backend} from "../../../services/backend.service";
import {Router} from "@angular/router";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'travel-add-receipt-modal',
    templateUrl: '../templates/traveladdreceiptmodal.html'
})
export class TravelAddReceiptModal implements AfterViewInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * The reference to the bottom toolbar.
     */
    @ViewChild('modalcontent', {static: false}) public modalcontent: ElementRef;

    /**
     * reference to the media upload component
     *
     * @private
     */
    @ViewChild(SystemInputMedia) private inputMedia: SystemInputMedia;

    /**
     * the file content
     */
    public file: string;

    /**
     * the hieght of the inner windo
     */
    public height = 0;

    /**
     * flag to save the travel receipt
     */
    public saveBean: boolean = true;

    /**
     * emits the bean data
     */
    public beanData: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public modal: modal,
        public model: model,
        public backend: backend,
        @Optional() public navigationtab: navigationtab,
        public router: Router) {

    }

    /**
     * ugly but needed to clculate height and initiate the uploader
     */
    public ngAfterViewInit(){
        setTimeout(() => {
            this.height = this.modalcontent ? this.modalcontent.nativeElement.offsetHeight : 0;
        }, 0);
    }

    /**
     * simple getter to get the image
     */
    get receipt() {
        return this.file;
    }

    /**
     * setter to set the image data (base64) and the metadata
     * @param imageData
     */
    set receipt(imageData: string) {
        let positionDelimiter = imageData.indexOf('|');
        this.file = imageData.substring(positionDelimiter + 1);
    }

    public reset(){
        this.inputMedia.removeImage();
        this.file = undefined;
    }


    public scan() {
        let loader = this.modal.await('LBL_PROCESSING');
        this.backend.postRequest('common/mindee/scan/receipt', {}, {parent_id: this.model.id, parent_type: this.model.module, filetype: 'image/jpeg', filedata: this.file, save: this.saveBean}).subscribe({
            next: (res) => {

                // emit the bean data
                this.beanData.emit(res);

                // if the bean has been saved navigate to the bean
                if(this.saveBean) {
                    // reload the subtab
                    this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'TravelReceipts'});

                    // navigate to the created receipt record
                    let objectlink = "/module/TravelReceipts/" + res.id;
                    // if we have a tabid and it is not th emain tab add it
                    if (this.navigationtab?.tabid) objectlink = '/tab/' + this.navigationtab.tabid + '/' + objectlink;
                    // navigate to the route
                    this.router.navigate([objectlink]);
                }

                // close the modal
                this.self.destroy();

                // emit the message
                loader.emit(true);
            }, error: (e) =>{
                loader.emit(true);
            }
        })
    }

    public close() {
        // emit false so we now the user has cancelled
        this.beanData.emit(false);
        this.self.destroy();
    }


}

