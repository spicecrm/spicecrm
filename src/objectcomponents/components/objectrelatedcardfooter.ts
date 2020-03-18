/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Router} from '@angular/router';

/**
 * the footer in the object-related-card
 *
 * This triggers a view all button that navigates to the view all route and also a refresh button to reload the list
 */
@Component({
    selector: 'object-related-card-footer',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardfooter.html'
})
export class ObjectRelatedCardFooter implements OnInit {

    /**
     * the component config as key paramater into the component
     */
    @Input() private componentconfig;

    /**
     * @ignore
     *
     * the module of the card: set in ngOnInit from the config
     */
    private module: string = '';

    /**
     * @ignore
     *
     * the fieldset of the card: set in ngOnInit from the config. This is used to feed the related model route
     */
    private fieldset: string = undefined;

    /**
     * qignore
     *
     * currently not used .. to be implemented to allow showing more record
     */
    private _displayitems = 5;

    /**
     * internal guid to issue an id and name for the radiogroup to select the list size
     */
    private componentid: string;

    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private router: Router, private navigationtab: navigationtab) {
        this.componentid = this.model.utils.generateGuid();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.fieldset = this.componentconfig.fieldset;
        this.module = this.componentconfig.object;
    }

    /**
     * @ignore
     *
     * getter for the items to be displayed
     *
     * ToDo: add logic for setting that by the user
     */
    get displayitems() {
        return this._displayitems;
    }

    /**
     * @ignore
     *
     * setter for the items to be displayed
     *
     * ToDo: add logic for setting that by the user
     */
    set displayitems(items) {
        if (items !== this.displayitems) {
            this.displayitems = items;
            this.relatedmodels.loaditems = items;
            this.relatedmodels.getData();
        }
    }

    /**
     * a helper to check if the view All button shoudl be displayed or not
     */
    private canViewAll() {
        return this.relatedmodels.count > 0; // this.relatedmodels.items.length;
    }

    private canSetCount() {
        return this.relatedmodels.count > this.relatedmodels.items.length;
    }

    /**
     * navigates to the route to show all related mndels
     */
    private showAll() {
        let routePrefix = '';
        if(this.navigationtab?.tabid){
            routePrefix = '/tab/'+this.navigationtab.tabid;
        }

        if (this.fieldset && this.fieldset != '') {
            this.router.navigate([routePrefix + '/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName + '/' + this.fieldset]);
        } else {
            this.router.navigate([routePrefix + '/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
        }
    }

    /**
     * triggers the reload of the related models service
     */
    private reload() {
        this.relatedmodels.getData();
    }
}
