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
    templateUrl: './src/objectcomponents/templates/objectlistitem.html',
    providers: [model, view],
    styles: [
        ':host /deep/ field-container global-button-icon {display:none;}',
        ':host:hover /deep/ field-container global-button-icon {display:inline;}',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectListItem implements OnInit, OnDestroy {

    /**
     * set to treu if the rowselect checkboy should be displayed
     */
    @Input() private rowselect: boolean = false;

    /**
     * if the select ois to be displayed but disabled
     */
    @Input() private rowselectdisabled: boolean = false;

    /**
     * the listfields to be displayed
     */
    @Input() private listFields: any[] = [];

    /**
     * the item
     */
    @Input() private listItem: any = {};

    /**
     * set to true to enable inline editing
     * set from the list from the config
     */
    @Input() private inlineedit: boolean = false;

    /**
     * by default links are dislayed. But in some views the links hsoudl be disabled
     */
    @Input() private displaylinks: boolean = true;

    /**
     * if set to true an action item is rendered
     */
    @Input() private showActionMenu: boolean = true;

    /**
     * a subscription to the data$ of the model
     */
    private modelSubscription: any;

    constructor(private model: model, private modelutilities: modelutilities, private modellist: modellist, private view: view, private router: Router, private language: language, private cdref: ChangeDetectorRef) {
        this.view.displayLabels = false;
    }

    /**
     * initialize and subscribe to the model changes
     */
    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.id = this.listItem.id;
        this.model.data = this.modelutilities.backendModel2spice(this.modellist.module, this.listItem);
        this.model.initializeFieldsStati();

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
        this.view.displayLinks = this.displaylinks;

        // register that the check is run
        this.modelSubscription = this.model.data$.subscribe(data => this.cdref.detectChanges());
    }

    /**
     * unsubscribe from the model data when the component is destroyed
     */
    public ngOnDestroy(): void {
        if(this.modelSubscription) this.modelSubscription.unsubscribe();
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}
