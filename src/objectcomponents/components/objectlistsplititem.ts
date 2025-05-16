/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnDestroy,
    OnInit, SkipSelf
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';
import {Subscription} from "rxjs";
import {ListTypeI} from "../../services/interfaces.service";
import {model} from "../../services/model.service";
import {skip} from "rxjs/operators";
import {view} from "../../services/view.service";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list-split-item',
    templateUrl: '../templates/objectlistsplititem.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model, view]
})
export class ObjectListSplitItem implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * ths data of the item from the listservice
     */
    @Input() data: any;

    /**
     * holds the subscriptions
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata,
                public modellist: modellist,
                @SkipSelf() public parent: model,
                public model: model,
                public view: view,
                public cdRef: ChangeDetectorRef
    ) {
        // load the compknent config
        this.componentconfig = this.metadata.getComponentConfig('ObjectListSplitItem', this.parent.module);

        // set the view to no labels
        this.view.displayLabels = false;

        this.subscriptions.add(
            this.modellist.selectionChanged$.subscribe({
                next: () => {
                    this.cdRef.detectChanges();
                }
            })
        )
    }

    /**
     * call to initialize the component
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.parent.module;
        this.model.id = this.data.id;
        this.model.initialize();
        this.model.setData(this.data);
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    get actionset(){
        return this.componentconfig.actionset;
    }

    get fieldset(){
        return this.componentconfig.fieldset;
    }

    get subfieldset(){
        return this.componentconfig.subfieldset;
    }

    public isSelected(){
        return this.modellist.listData.list.find(i => i.id == this.model.id).selected;
    }

    public selectItem(){
        this.modellist.listData.list.filter(i => i.selected).forEach(is => is.selected = false);
        this.modellist.listData.list.find(i => i.id == this.model.id).selected = true;
        this.modellist.selectionChanged$.emit(true);
    }


}
