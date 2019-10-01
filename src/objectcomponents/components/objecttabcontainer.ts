/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

/**
 * renders the tab header. Depending on the configuration this is either a simple label or can be a component that is rendered.
 * The component can render information on the tab itself
 */
@Component({
    selector: 'object-tab-container-item-header',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritemheader.html'
})
export class ObjectTabContainerItemHeader implements AfterViewInit {
    /**
     * the reference to the header where the compponent is placed in
     */
    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) private headercontainer: ViewContainerRef;

    /**
     * the inpout from teh tab embedding the header
     */
    @Input() private tab: any = [];

    constructor(private metadata: metadata, private language: language) {

    }

    /**
     * returns the name for the tab if no component is rendered
     */
    get displayName() {
        return !this.tab.headercomponent && this.tab.name && this.tab.name != '';
    }

    /**
     * after view init renders the component if one is set in teh componentconfig
     */
    public ngAfterViewInit() {
        if (this.tab.headercomponent) {
            this.metadata.addComponent(this.tab.headercomponent, this.headercontainer);
        }
    }


    /**
     * @deprecated
     *
     * ToDo remove
     *
     * @param label
     */
    private getTabLabel(label) {
        if (label.indexOf(':') > 0) {
            let arr = label.split(':');
            return this.language.getLabel(arr[0], arr[1])
        } else {
            return this.language.getLabel(label);
        }
    }
}


/**
 * the item itself rendering the tab
 */
@Component({
    selector: 'object-tab-container-item',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectTabContainerItem implements AfterViewInit, OnDestroy {
    /**
     * component reference to the container itself
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * an array with componentrefs to be used when the component is dexytoryed to also ensure all dynamic components are destroyed
     */
    private componentRefs: any = [];

    /**
     * internal variable to check if the component is initialized. Tabs are not initialized by default but only once the user selects a tab. This improves the load performance since related records e.g. are not yet loaded
     */
    private initialized: boolean = false;

    /**
     * the componetnset to be rendered
     */
    @Input() private componentset: any = [];

    /**
     * in case errors are renderd from a fieldgroup on the tab this is emitted on the tab level to guide the user in multi tabbed scenarios on the detail view
     */
    @Output() private taberrors = new EventEmitter();

    constructor(private metadata: metadata, private fielderrorgroup: fielderrorgrouping) {
    }

    /**
     * link to the fieldgrou if there is one in the tab. If fields are int eh tabe they will link themselves to a fieldgroup
     */
    public ngOnInit() {
        this.fielderrorgroup.change$.subscribe((nr) => {
            this.taberrors.emit(nr);
        });
    }

    /**
     * initialize itself
     */
    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    /**
     * cleanup after destroy
     */
    public ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
    }

    /**
     * renders the contaioner and the componentsets
     */
    private buildContainer() {
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
                componentRef.instance.componentconfig = component.componentconfig;
            });
        }
    }
}

/**
 * renders a tabcontainer with separate tabs
 */
@Component({
    selector: 'object-tab-container',
    templateUrl: './src/objectcomponents/templates/objecttabcontainer.html'
})
export class ObjectTabContainer implements OnInit {
    /**
     * the index of the active tab
     */
    private activeTab: number = 0;

    /**
     * holds which tabs have been activated. Since they are only rnedered when clicked or set to forcerender
     */
    private activatedTabs: number[] = [0];

    /**
     * the componentconfig
     */
    private componentconfig: any;

    /**
     * the tabs to be rendered
     *
     * ToDo: remove from the legacy support that this can also be defined as JSON
     */
    private tabs: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    /**
     * loads the tabs
     */
    public ngOnInit() {
        if (this.getTabs().length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            } else {
                let componentconfig = this.metadata.getComponentConfig('ObjectTabContainer', this.model.module);
                let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            }
        } else {
            this.tabs = this.getTabs();
        }
    }

    /**
     * @deprecated
     *
     * legacy support to get tabs from the config. Shoudl be removd already in most of the config and no longer really be used
     *
     * ToDo: remove
     */
    private getTabs() {
        try {
            return this.componentconfig.tabs ? this.componentconfig.tabs : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * chanmge teh active tab and render it
     * @param index
     */
    private setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /**
     * checks if the tab is to be rendered or forced to be rendered. If not is will be (by ngIf only be rendered when the tab is selected
     * @param tabindex
     */
    private checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.tabs && this.tabs[tabindex].forcerender);
    }
}
