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
    templateUrl: "../templates/systemfileicon.html"
})
export class SystemFileIcon implements OnInit {
    /**
     * thze mime type or type of the file
     */
    @Input() public filemimetype: string = "";

    /**
     * the name of the file
     */
    @Input() public filename: string = "";

    /**
     * the size fo the icon
     */
    @Input() public size: '' | 'large' | 'small' | 'x-small' | 'xx-small' = '';

    /**
     * additonal classes
     */
    @Input() public addclasses: string = "";

    /**
     * the default div class
     */
    @Input() public divClass = "slds-media__figure";

    /**
     * the fileicon as determined
     */
    public fileicon: any = {icon: 'unknown', sprite: 'doctype'};

    constructor(public metadata: metadata, public helper: helper) {

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
    public determineIcon() {
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
