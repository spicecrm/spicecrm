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

/**
 * renders a tile for a media file
 */
@Component({
    selector: 'media-files-tile',
    templateUrl: './src/modules/mediafiles/templates/mediafilestile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model, view]
})
export class MediaFilesTile implements OnInit {

    /**
     * the data for the model
     */
    @Input() private data: any;

    /**
     * if this is rendered as a select box
     */
    @Input() private selectbox: boolean = false;

    /**
     * the fieldset to be rendered
     */
    private fieldset: string;

    /**
     * the actionset to be rendered
     */
    private actionset: string;

    constructor(private metadata: metadata, private model: model, private view: view, private sanitizer: DomSanitizer) {
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
    private initializeView() {
        this.view.isEditable = false;
        this.view.displayLabels = false;

        if (this.selectbox == true) {
            this.view.displayLinks = false;
        }
    }

    /**
     * loads the config for the component
     */
    private getConfig() {
        let config = this.metadata.getComponentConfig('MediaFilesTile', 'MediaFiles');

        this.fieldset = config.fieldset;
        this.actionset = config.actionset;
    }

    /**
     * loads the model from teh data
     */
    private initializeModel() {
        this.model.module = 'MediaFiles';
        this.model.id = this.data.id;
        this.model.data = this.model.utils.backendModel2spice('MediaFiles', this.data);
    }

    /**
     * getter for the thumbnail
     */
    get thumbnail() {
        let thumbnail = this.model.getField('thumbnail');
        if (thumbnail) {
            return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + thumbnail);
        }
        return false;
    }

}
