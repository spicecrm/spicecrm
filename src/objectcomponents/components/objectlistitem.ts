/**
 * @module ObjectComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

/**
 * renders a TR item for the modellist
 */
@Component({
    selector: '[object-list-item]',
    templateUrl: '../templates/objectlistitem.html',
    providers: [model, view],
    styles: [
        ':host  field-container global-button-icon {display:none;}',
        ':host:hover  field-container global-button-icon {display:inline;}',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectListItem implements OnInit, OnDestroy {

    /**
     * set to true if the rowselect checkboy should be displayed
     */
    @Input() public rowselect: boolean = false;

    /**
     * set to true if row numbers shoudl be displayed
     */
    @Input() public rownumbers: boolean = false;

    /**
     * set to true if drag handles should be displayed
     */
    @Input() public dragHandles: boolean = false;

    /**
     * if the select ois to be displayed but disabled
     */
    @Input() public rowselectdisabled: boolean = false;

    /**
     * the item
     */
    @Input() public listItem: any = {};

    /**
     * set to true to enable inline editing
     * set from the list from the config
     */
    @Input() public inlineedit: boolean = false;

    /**
     * by default links are dislayed. But in some views the links hsoudl be disabled
     */
    @Input() public displaylinks: boolean = true;

    /**
     * set to true to display line numbers
     *
     * @private
     */
    @Input() public rowNumber: number;

    /**
     * if set to true an action item is rendered
     */
    @Input() public showActionMenu: boolean = true;

    /**
     * an array of subscriptions
     */
    public subscriptions: any[] = [];


    constructor(public model: model, public modelutilities: modelutilities, public modellist: modellist, public view: view, public router: Router, public language: language, public cdref: ChangeDetectorRef) {
        this.view.displayLabels = false;
    }

    /**
     * getter for the listfields
     */
    get listFields() {
        return this.modellist.listfields;
    }

    /**
     * initialize and subscribe to the model changes
     */
    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.id = this.listItem.id;
        this.model.setData(this.listItem);
        this.model.initializeFieldsStati();

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
        this.view.displayLinks = this.displaylinks;

        // register that the check is run
        this.subscriptions.push(this.model.data$.subscribe(data => this.cdref.detectChanges()));

        // register to listfield changes
        this.subscriptions.push(this.modellist.listfield$.subscribe(data => this.cdref.detectChanges()));

        // trigger change detection on list service
        this.subscriptions.push(this.modellist.selectionChanged$.subscribe(data => this.cdref.detectChanges()));
    }

    /**
     * unsubscribe from any subscription we have
     */
    public ngOnDestroy(): void {
        for(let subscription of this.subscriptions){
            subscription.unsubscribe();
        }
    }

    public navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}
