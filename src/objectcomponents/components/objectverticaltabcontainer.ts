import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';


@Component({
    selector: 'object-vertical-tab-container-item-header',
    templateUrl: './app/objectcomponents/templates/objectverticaltabcontaineritemheader.html'
})
export class ObjectVerticalTabContainerItemHeader {

    @Input() tab: any = [];

    constructor(private metadata: metadata, private language: language) {

    }

    get displayName() {
        return this.tab.name && this.tab.name != '';
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
    selector: 'object-vertical-tab-container-item',
    templateUrl: './app/objectcomponents/templates/objectverticaltabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectVerticalTabContainerItem implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    componentRefs: any = [];
    initialized: boolean = false;
    @Input() componentset: any = [];
    @Output() taberrors = new EventEmitter();

    constructor(private metadata: metadata, private fielderrorgroup: fielderrorgrouping ) {
    }

    ngOnInit() {
        this.fielderrorgroup.change$.subscribe( (nr) => {
            this.taberrors.emit( nr );
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
        this.componentRefs = [];
    }

    buildContainer() {
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
                componentRef.instance['componentconfig'] = component.componentconfig;
            })
        }
    }

}

@Component({
    selector: 'object-vertical-tab-container',
    templateUrl: './app/objectcomponents/templates/objectverticaltabcontainer.html',
    styles: [
            `.slds-is-active {
            font-weight: 600;
            color: #3e3e3c;
            border-right: 1px solid #dddbda;
            border-left: 6px solid #CA1B21;
        }

        .slds-is-active a {
            text-decoration: none !important
        }`,
            '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectVerticalTabContainer implements OnInit {

    @ViewChild('tabscontainer', {read: ViewContainerRef}) tabscontainer: ViewContainerRef;
    activeTab: number = 0
    activatedTabs: Array<number> = [0];
    componentconfig: any = [];

    constructor(private language: language, private metadata: metadata) {
    }

    ngOnInit() {
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.componentconfig = [];
            for (let item of items) {
                this.componentconfig.push(item.componentconfig);
            }
        }
    }

    getTabs() {
        try {
            return this.componentconfig ? this.componentconfig : [];
        } catch (e) {
            return [];
        }
    }

    getTabLabel(label) {
        if (label.indexOf(':') > 0) {
            let arr = label.split(':');
            return this.language.getLabel(arr[0], arr[1])
        } else
            return this.language.getLabel(label)
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.componentconfig && this.componentconfig[tabindex].forcerender);
    }

    getDisplay(tabindex) {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();

        if (tabindex !== this.activeTab)
            return {
                display: 'none'
            };
        return {
            'height': 'calc(99.9vh - ' + (rect.top) + 'px)',
            'overflow': 'auto',
        }

    }

    getTabsStyle() {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(99.9vh - ' + (rect.top) + 'px)',
            'overflow': 'auto',
            'overflow-x': 'hidden'
        }
    }

    showErrorsOnTab( tabindex, nrErrors ) {
        this.componentconfig[tabindex].hasErrors = nrErrors;
    }

}
