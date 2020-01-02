/**
 * @module ObjectComponents
 */

import {AfterViewInit, Component, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
import {userpreferences} from '../../services/userpreferences.service';

/**
 * the default route set to display the list view
 */
@Component({
    selector: 'object-listview',
    templateUrl: './src/objectcomponents/templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements AfterViewInit, OnDestroy {

    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    private componentRefs: any = [];

    /**
     * the subscription to the list view changes since the component is rendered here
     */
    private modellistSubscription: any;

    constructor(private navigation: navigation, private activatedRoute: ActivatedRoute, private metadata: metadata, private modellist: modellist, private model: model, private userpreferences: userpreferences) {

        // get the module from teh activated route
        this.model.module = this.activatedRoute.params['value']['module'];

        // set the navigation paradigm
        this.navigation.setActiveModule(this.model.module);

        // set the module and get the list
        this.modellist.module = this.model.module;

        // set so the views use the cahced results
        this.modellist.usecache = true;
    }

    /**
     * register the listener to the modellist service to
     */
    public ngAfterViewInit() {
        this.modellistSubscription = this.modellist.listcomponent$.subscribe(listcomponent => {
            if (listcomponent) {
                // set the current list and rebuild the container
                this.buildContainer(listcomponent);
            }
        });
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
     * @param component the component to be rendered
     */
    private buildContainer(component) {
        // clean the existing rendered components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // render the new component
        this.metadata.addComponent(component, this.container).subscribe(componentRef => {
            this.componentRefs.push(componentRef);
        });
    }

}
