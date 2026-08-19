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
                style({ right: '-320px', overflow: 'hidden' }),
                animate('.5s', style({ right: '0px' })),
                style({ overflow: 'unset' })
            ]),
            transition(':leave', [
                style({ overflow: 'hidden' }),
                animate('.5s', style({ right: '-320px' }))
            ])
        ])
    ],
    standalone: false
})
export class ObjectListViewHeader {
    /**
     * the actionset to be rendered
     */
    public actionSet: any = {};

    /**
     * an attribute that can be set to hide the settings button
     *
     * @param value
     */
    public noSettings: boolean = false;
    @Input('object-listview-header-nosettings') set setNoSettings(value) {
        if (value === false) {
            this.noSettings = false;
        } else {
            this.noSettings = true;
        }
    }

    /**
     * an attribute that can be set to hide the selector button
     *
     * @param value
     */
    public noSelector: boolean = false;
    @Input('object-listview-header-noselector') set setNoSelector(value) {
        if (value === false) {
            this.noSelector = false;
        } else {
            this.noSelector = true;
        }
    }

    /**
     * an attribute that can be set to hide the actionset
     *
     * @param value
     */
    public noActionSet: boolean = false;
    @Input('object-listview-header-noactionset') set setNoActionSet(value) {
        if (value === false) {
            this.noActionSet = false;
        } else {
            this.noActionSet = true;
        }
    }

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
