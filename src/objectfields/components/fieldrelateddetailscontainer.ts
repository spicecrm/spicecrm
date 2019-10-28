/**
 * @module ObjectFields
 */
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'field-related-details-container',
    templateUrl: './src/objectfields/templates/fieldrelateddetailscontainer.html',
    providers: [model, view]
})
export class fieldRelatedDetailsContainer implements OnChanges {

    @Input() private module: string;
    @Input() private id: string;
    @Input() private componentset: string;

    constructor(public model: model, public view: view) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(this.module != this.model.module || this.id != this.model.id) {
            this.model.module = this.module;
            this.model.id = this.id;
            this.model.getData(true);
        }
    }

}
