/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit, Output} from '@angular/core';
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
    templateUrl: '../templates/objectrelatedcardfooter.html'
})
export class ObjectRelatedCardFooter implements OnInit {

    /**
     * the component config as key paramater into the component
     */
    @Input() public componentconfig;

    /**
     * whether reload of related data should be disabled
     * needed i.e. in ObjectRelatedDuplicates panel
     */
    @Input()public disableReload: boolean = false;

    /**
     * @ignore
     *
     * the module of the card: set in ngOnInit from the config
     */
    public module: string = '';

    /**
     * @ignore
     *
     * the fieldset of the card: set in ngOnInit from the config. This is used to feed the related model route
     */
    public fieldset: string = undefined;

    /**
     * qignore
     *
     * currently not used .. to be implemented to allow showing more record
     */
    public _displayitems = 5;

    /**
     * internal guid to issue an id and name for the radiogroup to select the list size
     */
    public componentid: string;

    /**
     * indicates that we are paginating and the service is loading
     *
     * @private
     */
    public paginating: boolean = false;

    constructor(public language: language, public relatedmodels: relatedmodels, public model: model, public router: Router, public navigationtab: navigationtab) {
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
    get canViewAll() {
        return this.relatedmodels.count > 0 && this.relatedmodels.count > this.relatedmodels.items.length; // this.relatedmodels.items.length;
    }

    public canSetCount() {
        return this.relatedmodels.count > this.relatedmodels.items.length;
    }

    /**
     * navigates to the route to show all related mndels
     */
    public showAll() {
        let routePrefix = '';
        if (this.navigationtab?.tabid) {
            routePrefix = '/tab/' + this.navigationtab.tabid;
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
    public reload() {
        if(!this.disableReload) {
            this.relatedmodels.offset = 0;
            this.paginating = true;
            this.relatedmodels.getData().subscribe(() => this.paginating = false);
        }
    }

    /**
     * getter if the next button should be disabled
     */
    get nextDisabled() {
        return this.relatedmodels.offset + this.relatedmodels.loaditems >= this.relatedmodels.count;
    }

    /**
     * navigate one page forward
     *
     * @private
     */
    public nextPage() {
        if (!this.nextDisabled) {
            this.relatedmodels.offset = this.relatedmodels.offset + this.relatedmodels.loaditems;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * navigate to the last page
     *
     * @private
     */
    public lastPage() {
        if (!this.nextDisabled) {
            let lastOffset = Math.floor(this.relatedmodels.count / this.relatedmodels.loaditems) * this.relatedmodels.loaditems;
            this.relatedmodels.offset = lastOffset;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * getter if the previous and first buttons sh9udl be disabled
     */
    get previousDisabled() {
        return this.relatedmodels.offset == 0;
    }

    /**
     * navigate to the previous page
     *
     * @private
     */
    public previousPage() {
        if (!this.previousDisabled) {
            this.relatedmodels.offset = this.relatedmodels.offset - this.relatedmodels.loaditems;
            if (this.relatedmodels.offset < 0) this.relatedmodels.offset = 0;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * navigate to the first page
     *
     * @private
     */
    public firstPage() {
        if (!this.previousDisabled) {
            this.relatedmodels.offset = 0;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * gets the current page number
     */
    get page() {
        return this.relatedmodels.offset / this.relatedmodels.loaditems + 1;
    }

    /**
     * gets the total number of pages
     */
    get pages() {
        return Math.ceil(this.relatedmodels.count / this.relatedmodels.loaditems);
    }
}
