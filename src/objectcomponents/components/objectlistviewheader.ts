/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {layout} from "../../services/layout.service";

/**
 * renders the default header for a listview of a module
 */
@Component({
    selector: 'object-listview-header',
    templateUrl: '../templates/objectlistviewheader.html',
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectListViewHeader {
    /**
     * the actionset to be rendered
     */
    public actionSet: any = {};

    constructor(
        public metadata: metadata,
        public configuration: configurationService,
        public modellist: modellist,
        public layout: layout,
        public language: language,
        public model: model
    ) {
        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    set searchTerm(value: string) {

        if (value == this.modellist.searchTerm) return;

        this.modellist.searchTerm = value;
        this.reloadList();
    }

    get searchTerm(): string {
        return this.modellist.searchTerm;
    }

    /**
     * clears the searchterm
     * @private
     */
    public clearSearchTerm() {
        this.searchTerm = '';
    }

    /**
     * reload the model list on 1 second timeout
     * @private
     */
    public reloadList() {
        this.modellist.getListData();
    }
}
