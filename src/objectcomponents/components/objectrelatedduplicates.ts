import {Component, AfterViewInit, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicates.html'
})
export class ObjectRelatedDuplicates implements AfterViewInit {
    componentconfig: any = {};
    displayitems: number = 5;

    duplicates: Array<any> = [];
    hideDuplicates: boolean = true;

    constructor(private language: language, private model: model, private toast: toast) {

    }

    ngAfterViewInit() {
        this.checkDuplicates();
    }

    toggleDuplicates(){
        this.hideDuplicates = !this.hideDuplicates;
    }

    getToggleIcon(){
        return this.hideDuplicates ? 'down' : 'up';
    }

    merged(merged){
        if(merged) this.checkDuplicates();
    }

    get showMergeButton(){
        return this.duplicates.length > 0 && this.model.checkAccess('edit');
    }

    checkDuplicates(){
        this.duplicates = [];
        this.model.duplicateCheck().subscribe(data => {
            this.duplicates = data;
        });
    }
}