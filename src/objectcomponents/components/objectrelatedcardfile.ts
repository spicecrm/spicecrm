import {Component, Input, AfterViewInit} from "@angular/core";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {Router}   from "@angular/router";
import {modelattachments} from "../../services/modelattachments.service";

@Component({
    selector: "[object-related-card-file]",
    templateUrl: "./src/objectcomponents/templates/objectrelatedcardfile.html"
})
export class ObjectRelatedCardFile {

    @Input() private file: any = {};


    constructor(private modelattachments: modelattachments) {

    }

    private humanFileSize() {
        let thresh = 1024;
        let bytes: number = this.file.filesize;
        if (Math.abs(this.file.filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    private determineFileIcon() {
        if (this.file.file_mime_type) {
            let fileTypeArray = this.file.file_mime_type.split("/");
            // check the application
            switch (fileTypeArray[0]) {
                case "image":
                    return "image";
                case "text":
                    return "txt";
                default:
                    break;
            }

            // check the type
            switch (fileTypeArray[1]) {
                case "xml":
                    return "xml";
                case "pdf":
                    return "pdf";
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "excel";
                case "vnd.oasis.opendocument.text":
                    return "word";
                case "vnd.oasis.opendocument.presentation":
                    return "ppt";
                case "x-zip-compressed":
                    return "zip";
                case "x-msdownload":
                    return "exe";
                default:
                    break;
            }
        }

        return "unknown";
    }

    private downloadFile() {
        this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
    }
}
