/**
 * @module ModuleTravels
 */
import {
    AfterContentChecked,
    AfterRenderPhase,
    AfterRenderRef,
    AfterViewInit,
    Component,
    ElementRef, Optional,
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
        this.backend.postRequest('common/mindee/scan/receipt', {}, {travel_id: this.model.id, filetype: 'image/jpeg', filedata: this.file}).subscribe({
        //this.backend.postRequest('common/klippa/scan', {}, {travel_id: this.model.id, filetype: 'image/jpeg', filedata: this.file}).subscribe({
            next: (res) => {
                // reload the subtab
                this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'TravelReceipts'});

                // navigate to the created receipt record
                let objectlink = "/module/TravelReceipts/" + res.id;
                // if we have a tabid and it is not th emain tab add it
                if (this.navigationtab?.tabid) objectlink = '/tab/' + this.navigationtab.tabid + '/' + objectlink;
                // navigate to the route
                this.router.navigate([objectlink]);

                // close the modal
                this.close();

                // emit the message
                loader.emit(true);
            }, error: (e) =>{
                loader.emit(true);
            }
        })
    }

    public close() {
        this.self.destroy();
    }


}

