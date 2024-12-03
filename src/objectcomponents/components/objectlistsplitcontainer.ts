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
import {outlookNameValuePairI} from "../../include/outlook/interfaces/outlook.interfaces";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list-split-container',
    templateUrl: '../templates/objectlistsplitcontainer.html',
    providers: [model, view]
})
export class ObjectListSplitContainer implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    public componentset: string;

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
                public model: model
    ) {
        // load the compknent config
        this.componentconfig = this.metadata.getComponentConfig('ObjectListSplitContainer', this.parent.module);
        this.componentset = this.componentconfig.componentset;

        this.subscriptions.add(
            this.modellist.selectionChanged$.subscribe({
                next: () => {
                    this.setData();
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
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    public setData(){
        let item = this.modellist.listData.list.find(i => i.selected);
        if(item) {
            this.model.id = item.id;
            this.model.initialize();
            this.model.setData(item);
            this.componentset = undefined;
            window.setTimeout(() => {
                this.componentset = this.componentconfig.componentset;
            }, 0);
        } else {
            this.model.id = undefined;
        }
    }
}
