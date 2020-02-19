/**
 * @module ModuleScrum
 */
import {Component, ViewChild, ViewContainerRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {scrumtree} from '../services/scrum.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'scrum-tree-detail',
    templateUrl: './src/modules/scrum/templates/scrumtreedetail.html',
    providers: [model, view]
})
export class ScrumTreeDetail implements OnChanges, OnDestroy {
    /**
     * container for the rendering the details of the selected object
     */
    @ViewChild('scrumdetailcontainer', {
        read: ViewContainerRef,
        static: true
    }) private scrumdetailcontainer: ViewContainerRef;

    /**
     * inputs of the id and the type of the focused object
     */
    @Input() private focusid: string = '';
    @Input() private focustype: string = '';

    private viewComponent: any = null;

    /**
     * the componentset to be rendered
     */
    private componentset: string;

    /**
     * holds all subscriptions for the componentn to be unsubscribed in onDestroy
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private scrum: scrumtree, private metadata: metadata, private model: model) {

    }

    /**
     * reacts on ch<nges and if required destroy the view, reloads it and also load the model
     */
    public ngOnChanges() {

        if (this.focusid && this.focusid != this.model.id) {
            this.model.id = this.focusid;
            this.model.module = this.focustype;
            this.model.getData();

            let config = this.metadata.getComponentConfig('ScrumTreeDetail', this.model.module);
            this.componentset = config.componentset;
            /*
            this.destroyContainer();

            if (this.focusid) {
                if (!this.viewComponent) {
                    this.metadata.addComponent('ObjectPageHeader', this.scrumdetailcontainer)
                    this.metadata.addComponent('ObjectRecordDetails', this.scrumdetailcontainer).subscribe(component => {
                        this.viewComponent = component;
                    });
                }
            }

             */
        } else if(!this.focusid) {
            // this.destroyContainer();
            this.componentset = undefined;
        }

    }

    private destroyContainer(){
        if (this.viewComponent) {
            this.viewComponent.destroy();
            this.viewComponent = null;
        }
    }

    /**
     * unsubscribe from the subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * permission to edit
     */
    get canEdit() {
        try {
            return this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }


}
