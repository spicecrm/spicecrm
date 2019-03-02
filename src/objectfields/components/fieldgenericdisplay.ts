/**
 * @module ObjectFields
 */
import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: 'field-generic-display',
    templateUrl: './src/objectfields/templates/fieldgenericdisplay.html'
})
export class fieldGenericDisplay {
    @Input() public value: string = '';
    @Input() public editable: boolean = false;
    @Input() public fieldconfig: any = {};
    @Input() public fielddisplayclass: string = '';
    @Input() public fieldid: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
    }

    public isEditMode() {
        if (this.view.isEditMode() && this.editable) {
            return true;
        } else {
            return false;
        }
    }

    get link() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode(this.fieldid);
    }

    public goRecord() {
        if (this.link) {
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
        }
    }

    public onClick() {
        if(this.editable && !this.isEditMode()) {
            this.setEditMode();
        }
    }

}

