/**
 * @module ObjectComponents
 */

import {AfterViewInit, Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';

/**
 * the default route set to display the list view
 */
@Component({
    selector: 'object-listview',
    templateUrl: './src/objectcomponents/templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements OnInit, AfterViewInit {
    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef}) private container: ViewContainerRef;

    /**
     * the name of the module
     */
    private moduleName: any = '';

    /**
     * indicates if the view has been initialized
     */
    private initialized: boolean = false;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    private componentRefs: any = [];

    /**
     * the componentconfig as passed in or initialized
     */
    private componentconfig: any = {lists: []};

    private currentList: string = '';
    private currentListComponent: any = undefined;

    constructor(private navigation: navigation, private activatedRoute: ActivatedRoute, private metadata: metadata, private modellist: modellist, private model: model) {

        // get the module from teh activated route
        this.moduleName = this.activatedRoute.params['value']['module'];
        this.model.module = this.moduleName;

        // set the navigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // set the module and get the list
        this.modellist.setModule(this.moduleName);

        // set so the views use the cahced results
        this.modellist.usecache = true;

        if (this.initialized) this.buildContainer();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        if (this.lists.length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.componentconfig.lists = [];
                for (let item of items) {
                    this.componentconfig.lists.push({
                        component: item.component,
                        icon: item.componentconfig.icon,
                        label: item.componentconfig.name
                    });
                }
                // set the first as default list
                this.componentconfig.defaultlist = this.componentconfig.lists[0].component;
            } else {
                let componentconfig = this.metadata.getComponentConfig('ObjectListView', this.model.module);
                let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
                this.componentconfig = {
                    lists: []
                };
                for (let item of items) {
                    this.componentconfig.lists.push({
                        component: item.component,
                        icon: item.componentconfig.icon,
                        label: item.componentconfig.name
                    });
                }
                // set the first as default list
                this.componentconfig.defaultlist = this.componentconfig.lists[0].component;
            }
        }
    }

    get lists() {
        try {
            return this.componentconfig.lists ? this.componentconfig.lists : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.initialized = true;
        this.currentList = this.componentconfig.defaultlist;
        this.buildContainer();
    }

    /**
     * renders a compoentnset in the container
     */
    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
        if (this.componentconfig.defaultlist) {
            this.metadata.addComponent(this.currentList, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
            });
        }
    }

    /**
     * a getter for the style of the container to ensure that is rendered at full hieght with overflow hidden
     *
     * ToDo: check if not a specific toBottom compoennt would be better that is not scrollable
     */
    get containerStyle() {
        let rect = this.container.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'hidden'
        };
    }

    /*
     * tied to the oputput fromthe header to tolggle the event wnhn the list type changes
     */
    private handleHeaderEvent(event) {
        if (event.event && event.event == 'changelist') {
            this.currentList = event.list;
            this.buildContainer();
        }
    }
}
