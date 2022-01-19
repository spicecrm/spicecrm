/**
 * @module ObjectComponents
 */
import {
    OnInit,
    ComponentFactoryResolver,
    Component,
    Renderer2, Input, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-record-details',
    templateUrl: '../templates/objectrecorddetails.html',
    providers: [view]
})
export class ObjectRecordDetails implements OnInit, OnDestroy {

    /**
     * the componentset to be rendered
     */
    @Input() public componentSet: string;

    /**
     * optional to force the view to be readonly
     */
    @Input() public readonly: boolean;

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * any subscriptions the component might have
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public view: view, public metadata: metadata, public componentFactoryResolver: ComponentFactoryResolver, public model: model, public language: language, public renderer: Renderer2) {
    }

    public ngOnInit() {

        // build the container
        this.buildContainer();

        // check if we are in readonly mode or if the view shpoudl be set as editable
        if (this.readonly === true || this.componentconfig.readonly) {
            this.view.isEditable = false;
        } else {
            this.view.isEditable = true;

            this.view.linkedToModel = true;

            // subscribe to the view mode
            // in case the view is set external to editing .. also set the model to edit mode
            this.subscriptions.add(this.view.mode$.subscribe(mode => {
                if (mode == 'edit' && !this.model.isEditing) {
                    this.model.startEdit();
                }
            }));
        }

    }

    /**
     * destroy the component and unsubscribe form an ysubcription that still might remain
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * trys to get the compoenntset if it is not set and renders the container
     */
    public buildContainer() {
        if (!this.componentSet) {
            // if we do not have a coimponentset from external check the default config
            if (!this.componentconfig.componentset) {
                this.componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
                this.componentSet = this.componentconfig.componentset;
            } else {
                this.componentSet = this.componentconfig.componentset;
            }
        }
    }

    /**
     * adds the shadow for the editing style
     */
    public getBoxStyle() {
        if (this.view.isEditMode()) {
            return {
                'box-shadow': '0 2px 4px 4px rgba(0,0,0,.16)',
            };
        } else {
            return {};
        }
    }

    get showHeader() {
        return this.componentconfig.header ? true : false;
    }

    get header() {
        return this.language.getLabel(this.componentconfig.header, this.model.module);
    }

}
