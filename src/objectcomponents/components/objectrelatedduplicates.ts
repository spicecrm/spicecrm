/**
 * @module ObjectComponents
 */
import {Component, AfterViewInit} from '@angular/core';
import {model} from '../../services/model.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicates.html'
})
export class ObjectRelatedDuplicates implements AfterViewInit {
    public componentconfig: any = {};
    private displayitems: number = 5;

    private duplicates: any[] = [];
    private hideDuplicates: boolean = true;

    constructor(private language: language, private model: model, private toast: toast) {

    }

    public ngAfterViewInit() {
        this.checkDuplicates();
    }

    private toggleDuplicates() {
        this.hideDuplicates = !this.hideDuplicates;
    }

    private merged(merged) {
        if (merged) this.checkDuplicates();
    }

    get showMergeButton() {
        return this.duplicates.length > 0 && this.model.checkAccess('edit');
    }

    private checkDuplicates() {
        this.duplicates = [];
        this.model.duplicateCheck().subscribe(data => {
            this.duplicates = data;
        });
    }

    get iconStyle() {
        if (this.hideDuplicates) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }
}
