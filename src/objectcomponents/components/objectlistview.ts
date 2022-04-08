/**
 * @module ObjectComponents
 */

import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigationtab} from '../../services/navigationtab.service';
import {navigation} from '../../services/navigation.service';
import {userpreferences} from '../../services/userpreferences.service';
import {Subscription} from "rxjs";

/**
 * the default route set to display the list view
 */
@Component({
    selector: 'object-listview',
    templateUrl: '../templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements AfterViewInit, OnDestroy {

    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    public componentRefs: any = [];

    /**
     * true if the angular view has been initialized
     * @private
     */
    public viewInitialized: boolean = false;

    /**
     * the subscription to the list view changes since the component is rendered here
     */
    public modellistSubscription = new Subscription();

    constructor(public navigation: navigation,
                public navigationtab: navigationtab,
                public activatedRoute: ActivatedRoute,
                public metadata: metadata,
                public modellist: modellist,
                public model: model,
                public userpreferences: userpreferences) {
        this.initialize();
    }

    /**
     * set the model list data and subscribe to list type changes
     * @private
     */
    public initialize() {

        // get the module from teh activated route
        this.model.module = this.navigationtab.activeRoute.params.module;

        // set the module and get the list
        this.modellist.initialize(this.model.module);

        this.modellistSubscription = this.modellist.listTypeComponent$.subscribe(() =>
            this.handleListTypeChange()
        );
    }

    /**
     * set the component name build the container if the view is initialized
     * @private
     */
    public handleListTypeChange() {
        if (!this.viewInitialized) return;
        this.buildContainer();
    }

    /**
     * register the listener to the modellist service to
     */
    public ngAfterViewInit() {
        this.viewInitialized = true;
        this.buildContainer();
    }

    /**
     * unsubscribe from the modellist service so this can b e closed and cleaned up properly
     */
    public ngOnDestroy(): void {
        this.modellistSubscription.unsubscribe();
    }

    /**
     * renders a compoentnset in the container
     *
     */
    public buildContainer() {
        if (!this.modellist.currentList?.listcomponent) {
            return;
        }
        // clean the existing rendered components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // render the new component
        this.metadata.addComponent(this.modellist.currentList?.listcomponent, this.container).subscribe(componentRef => {
            this.componentRefs.push(componentRef);
        });
    }

}
