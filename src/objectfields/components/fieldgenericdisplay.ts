import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: 'field-generic-display',
    templateUrl: './app/objectfields/templates/fieldgenericdisplay.html'
})
export class fieldGenericDisplay
{
    @Input() value: string = '';
    @Input() editable: boolean = false;
    @Input() fieldconfig: any = {};
    @Input() fielddisplayclass: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
    }

    isEditMode() {
        if (this.view.mode === 'edit' && this.editable)
            return true;
        else
            return false;
    }

    get link() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    goRecord() {
        if(this.link) {
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
        }
    }


}

