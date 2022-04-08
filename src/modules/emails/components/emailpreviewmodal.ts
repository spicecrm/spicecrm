/**
 * @module SystemComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modelattachments} from '../../../services/modelattachments.service';

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    templateUrl: '../templates/emailpreviewmodal.html',
    providers: [model, view]
})
export class EmailPreviewModal implements OnInit {

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
     * the id of the attachment for the email
     */
    public file: any;

    /**
     * the fieldset to be rendered
     */
    public fieldset: string;

    /**
     * if the email is beiong loaded
     */
    public isLoading: boolean = true;

    constructor(public language: language, public metadata: metadata, public sanitizer: DomSanitizer, public backend: backend, public model: model, public view: view, public modelattachments: modelattachments) {
        this.model.module = 'Emails';

        let componentConfig = this.metadata.getComponentConfig('EmailPreviewModal', this.model.module);
        this.fieldset = componentConfig.fieldset;
    }

    /**
     * handles closing the modal
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    public ngOnInit() {
        this.backend.getRequest('module/Emails/msg/' + this.file.id).subscribe(response => {
            this.model.setFields(this.model.utils.backendModel2spice('Emails', response));
            this.isLoading = false;
        });
    }

    public download(){
        this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
    }

}
