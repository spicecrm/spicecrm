import {Component, AfterViewInit, OnInit, OnDestroy, Input} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-relatedlist-footer',
    templateUrl: './app/objectcomponents/templates/objectrelatedlistfooter.html'
})
export class ObjectRelatedlistFooter {

    @Input() module: string = '';
    @Input() fieldset: string = undefined;
    displayitems: number = 5;


    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private router: Router) {

    }

    setDisplayItems(count) {
        if (count !== this.displayitems) {
            this.displayitems = count;
            this.relatedmodels.loaditems = count;
            this.relatedmodels.getData();
        }
    }

    canViewAll() {
        return this.relatedmodels.count > 0; // this.relatedmodels.items.length;
    }

    canSetCount() {
        return this.relatedmodels.count > this.relatedmodels.items.length;
    }

    showAll() {
        if (this.fieldset && this.fieldset != '')
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName + '/' + this.fieldset]);
        else
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
    }

    reload(){
        this.relatedmodels.getData();
    }
}