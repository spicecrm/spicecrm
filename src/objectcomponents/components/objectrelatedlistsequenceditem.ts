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
    templateUrl: '../templates/objectrelatedlistsequenceditem.html',
    providers: [model, view]
})
export class ObjectRelatedListSequencedItem implements OnInit {
    @Input() public listfields: any[] = [];
    @Input() public listitem: any = {};
    @Input() public module = '';
    /**
     * optional list item action set that can be passed through
     */
    @Input() public listItemActionset: string;

    public componentconfig: any = {};

    constructor( public model: model, public view: view, public router: Router, public language: language ) {
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
        this.model.setData(this.listitem);
    }

    public navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

}
