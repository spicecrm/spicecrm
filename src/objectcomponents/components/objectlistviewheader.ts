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

    /**
     * the search timeout triggered by the keyup in the search box
     */
    public searchTimeOut: any;

    /**
     * indicates if the entered searchterms woudl provoke any error
     * dues to the min and max engram restrictions and thus
     * would certainly not pfind any results
     * @private
     */
    public searchTermError: boolean = false;

    constructor(
        public metadata: metadata,
        public configuration: configurationService,
        public modellist: modellist,
        public language: language,
        public model: model
    ) {
        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    set searchTerm(value: string) {
        if (value != this.modellist.searchTerm) {
            this.modellist.searchTerm = value;
            if(value == '' || this.searchTermsValid(value)) {
                this.searchTermError = false;
                this.reloadList();
            } else {
                // if we have a timeout set .. clear it
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                // set the error
                this.searchTermError = true;
            }
        }
    }

    get searchTerm(): string {
        return this.modellist.searchTerm;
    }

    /**
     * checks if we have the proper length of searchterms
     *
     * @param searchTerm
     * @private
     */
    public searchTermsValid(searchTerm) {
        let config = this.configuration.getCapabilityConfig('search');
        let minNgram = config.min_ngram ? parseInt(config.min_ngram, 10) : 3;
        let maxNgram = config.max_ngram ? parseInt(config.max_ngram, 10) : 20;
        let items = searchTerm.split(' ');
        return items.filter(i => i.length < minNgram || i.length > maxNgram).length == 0;
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
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
        this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
    }
}
