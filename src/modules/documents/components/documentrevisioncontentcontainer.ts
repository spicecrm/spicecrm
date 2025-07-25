import {Component} from '@angular/core';
import {model} from "../../../services/model.service";

@Component({
    selector: 'document-revision-content-container',
    templateUrl: '../templates/documentrevisioncontentcontainer.html',
    standalone: false
})
export class DocumentRevisionContentContainer {

    public componentconfig: {
        field_name_docx: string,
        field_name_pdf: string
    }

    constructor(public model: model) {
    }
}