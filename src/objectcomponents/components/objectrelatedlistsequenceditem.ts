/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-related-list-sequenced-item]',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistsequenceditem.html',
    providers: [model, view]
})
export class ObjectRelatedListSequencedItem implements OnInit {
    @Input() private listfields: any[] = [];
    @Input() private listitem: any = {};
    @Input() private module = '';
    /**
     * optional list item action set that can be passed through
     */
    @Input() private listItemActionset: string;

    public componentconfig: any = {};

    constructor( private model: model, private view: view, private router: Router, private language: language ) {
        this.view.isEditable = false;
    }


    /**
     * returns the action set that iss either passed in via input from the container or retrieved from the config
     */
    get actionset() {
        return !this.listItemActionset ? this.componentconfig.actionset : this.listItemActionset;
    }

    public ngOnInit() {
        this.view.displayLabels = false;
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.data = this.listitem;
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

}
