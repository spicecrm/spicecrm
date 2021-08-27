/**
 * @module SystemComponents
 */
import {Component, Input, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {helper} from "../../services/helper.service";

/**
 * renders a document type icon for the proper filetype
 */
@Component({
    selector: "system-file-icon",
    templateUrl: "./src/systemcomponents/templates/systemfileicon.html"
})
export class SystemFileIcon implements OnInit {
    /**
     * thze mime type or type of the file
     */
    @Input() private filemimetype: string = "";

    /**
     * the name of the file
     */
    @Input() private filename: string = "";

    /**
     * the size fo the icon
     */
    @Input() private size: '' | 'large' | 'small' | 'x-small' | 'xx-small' = '';

    /**
     * additonal classes
     */
    @Input() private addclasses: string = "";

    /**
     * the default div class
     */
    @Input() private divClass = "slds-media__figure";

    /**
     * the fileicon as determined
     */
    private fileicon: any = {icon: 'unknown', sprite: 'doctype'};

    constructor(private metadata: metadata, private helper: helper) {

    }

    /**
     * determine the icon on load
     */
    public ngOnInit(): void {
        this.determineIcon();
    }

    /**
     * determine the file icon
     */
    private determineIcon() {
        let icon = this.helper.determineFileIcon(this.filemimetype);
        if (icon == 'unknown') {
            let nameparts = this.filename.split('.');
            let type = nameparts.splice(-1, 1)[0];
            switch (type.toLowerCase()) {
                case 'msg':
                    this.fileicon = {
                        icon: 'email',
                        sprite: 'standard'
                    };
                    return;
                default:
                    break;
            }
        }
        this.fileicon = {
            icon: icon,
            sprite: 'doctype'
        };
    }

}
