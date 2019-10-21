/**
 * @module SystemComponents
 */
import {Component, Input, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {helper} from "../../services/helper.service";

@Component({
    selector: "system-file-icon",
    templateUrl: "./src/systemcomponents/templates/systemfileicon.html"
})
export class SystemFileIcon implements OnInit {
    @Input() private filemimetype: string = "";
    @Input() private filename: string = "";
    @Input() private size: string = "";
    @Input() private addclasses: string = ""
    @Input() private divClass = "slds-media__figure";

    private fileicon: any = {icon: 'unknown', sprite: 'doctype'};

    constructor(private metadata: metadata, private helper: helper) {

    }

    public ngOnInit(): void {
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
