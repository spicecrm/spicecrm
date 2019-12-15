/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'field-email-templates',
    templateUrl: './src/objectfields/templates/fieldemailtemplates.html'
})
export class fieldEmailTemplates extends fieldGeneric implements OnInit {

    private isLoaded: boolean = false;
    private availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    get subjectField() {
        return this.fieldconfig.subject ? this.fieldconfig.subject : 'name';
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'body';
    }


    get isDisabled() {
        return !this.model.getFieldValue('parent_type') || this.model.getFieldValue('parent_type') == '' || !this.isLoaded ? true : false || this.availableTemplates.length == 0;
    }

    private getValue() {
        for (let template of this.availableTemplates) {
            if (template.id == this.value) {
                return template.name;
            }
        }
    }

    /**
     * get the templates for the bean
     *
     * ToDo: swicth to separate route without the old filter style
     */
    public ngOnInit() {
        let templateFilterParams = {
            searchfields: JSON.stringify({
                join: 'AND', conditions: [
                    {field: 'for_bean', operator: '=', value: this.model.getFieldValue('parent_type')}
                ]
            })
        }

        this.backend.getRequest('module/EmailTemplates', templateFilterParams).subscribe((data: any) => {
            this.availableTemplates = data.list;
            this.isLoaded = true;
        });


    }

    /**
     * fires when the template is selected and triggers the parser
     *
     * @param event
     */
    private chooseTemplate(event) {
        if (this.value != '') {
            this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
                this.backend.getRequest('EmailTemplates/parse/' + this.value + '/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    // nur überschreiben wenn nicht bereits ein subject angegeben wurde.
                    if (!this.model.data[this.subjectField]) {
                        this.model.setField(this.subjectField, data.subject);
                    }
                    this.model.setField(this.bodyField, data.body_html);
                    modalRef.instance.self.destroy();
                });
            })
        }

    }
}