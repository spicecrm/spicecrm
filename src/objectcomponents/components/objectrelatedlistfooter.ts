import {Component, AfterViewInit, OnInit, OnDestroy, Input} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router} from '@angular/router';

@Component({
    selector: 'object-relatedlist-footer',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistfooter.html'
})
export class ObjectRelatedlistFooter {

    @Input() private module: string = '';
    @Input() private fieldset: string = undefined;
    private displayitems: number = 5;

    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private router: Router) {

    }

    private setDisplayItems(count) {
        if (count !== this.displayitems) {
            this.displayitems = count;
            this.relatedmodels.loaditems = count;
            this.relatedmodels.getData();
        }
    }

    private canViewAll() {
        return this.relatedmodels.count > 0; // this.relatedmodels.items.length;
    }

    private canSetCount() {
        return this.relatedmodels.count > this.relatedmodels.items.length;
    }

    private showAll() {
        if (this.fieldset && this.fieldset != '') {
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName + '/' + this.fieldset]);
        } else {
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
        }
    }

    private reload() {
        this.relatedmodels.getData();
    }
}