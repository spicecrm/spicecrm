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

@Component({
    selector: 'object-tab-container-item-header',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritemheader.html'
})
export class ObjectTabContainerItemHeader implements AfterViewInit {
    @ViewChild('headercontainer', {read: ViewContainerRef}) headercontainer: ViewContainerRef;

    @Input() tab: any = [];

    constructor(private metadata: metadata, private language: language) {

    }

    get displayName() {
        return !this.tab.headercomponent && this.tab.name && this.tab.name != '';
    }

    ngAfterViewInit() {
        if (this.tab.headercomponent) {
            this.metadata.addComponent(this.tab.headercomponent, this.headercontainer);
        }
    }

    getTabLabel(label) {
        if (label.indexOf(':') > 0) {
            let arr = label.split(':');
            return this.language.getLabel(arr[0], arr[1])
        } else
            return this.language.getLabel(label)
    }
}


@Component({
    selector: 'object-tab-container-item',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectTabContainerItem implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    componentRefs: any = [];
    initialized: boolean = false;
    @Input() componentset: any = [];
    @Output() taberrors = new EventEmitter();

    constructor(private metadata: metadata, private fielderrorgroup: fielderrorgrouping) {
    }

    ngOnInit() {
        this.fielderrorgroup.change$.subscribe((nr) => {
            this.taberrors.emit(nr);
        });
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
    }

    buildContainer() {
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
                componentRef.instance['componentconfig'] = component.componentconfig;
            });
        }
    }
}

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
    private componentconfig: any ;

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
