/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    Component, Input,
    OnInit
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {modal} from '../../../services/modal.service';
import {mediafiles} from '../../../services/mediafiles.service';

/**
 * renders a tile for a media file
 */
@Component({
    selector: 'media-files-tile',
    templateUrl: '../templates/mediafilestile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [mediafiles, model, view]
})
export class MediaFilesTile implements OnInit {

    /**
     * the data for the model
     */
    @Input() public data: any;

    /**
     * if this is rendered as a select box
     */
    @Input() public selectbox: boolean = false;

    /**
     * the fieldset to be rendered
     */
    public fieldset: string;

    /**
     * the actionset to be rendered
     */
    public actionset: string;

    constructor( public metadata: metadata, public model: model, public view: view, public sanitizer: DomSanitizer, public modal: modal, public mediafiles: mediafiles ) {
        // load the config
        this.getConfig();
    }

    public ngOnInit(): void {
        // initializee the view
        this.initializeView();

        // initialize the model
        this.initializeModel();
    }

    /**
     * sets the view properties
     */
    public initializeView() {
        this.view.isEditable = false;
        this.view.displayLabels = false;

        if (this.selectbox == true) {
            this.view.displayLinks = false;
        }
    }

    /**
     * loads the config for the component
     */
    public getConfig() {
        let config = this.metadata.getComponentConfig('MediaFilesTile', 'MediaFiles');

        this.fieldset = config.fieldset;
        this.actionset = config.actionset;
    }

    /**
     * loads the model from teh data
     */
    public initializeModel() {
        this.model.module = 'MediaFiles';
        this.model.id = this.data.id;
        this.model.setData(this.data);
    }

    /**
     * getter for the thumbnail
     */
    get thumbnail() {
        let thumbnail = this.model.getField('thumbnail');
        if (thumbnail) {
            return this.sanitizer.bypassSecurityTrustResourceUrl('data:'+this.model.getField('filetype')+';base64,' + thumbnail);
        }
        return false;
    }

    /**
     * Show the image with maximal size in a modal window.
     */
    public expand() {
        this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
            modalref.instance.imgname = this.model.getFieldValue('name');
            modalref.instance.imgtype = this.model.getFieldValue('filetype');
            this.mediafiles.getImageBase64( this.model.id ).subscribe( data => {
                modalref.instance.imgsrc = 'data:' + this.model.getFieldValue('filetype') + ';base64,' + data.img;
            });
        });
    }

}
