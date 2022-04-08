/**
 * @module ModuleActivities
 */
import {
    AfterViewInit,
    Component,
    OnInit,
    QueryList,
    ViewChildren,
    ViewContainerRef,
    ElementRef,
    Renderer2,
    OnDestroy, ViewChild
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';

@Component({
    selector: 'activitytimeline-add-container',
    templateUrl: '../templates/activitytimelineaddcontainer.html'
})
export class ActivityTimelineAddContainer implements OnInit, AfterViewInit, OnDestroy {

    @ViewChildren('maintabs', {read: ViewContainerRef}) public maintabs: QueryList<any>;
    @ViewChildren('moretabs', {read: ViewContainerRef}) public moretabs: QueryList<any>;
    @ViewChild('moretab', {read: ViewContainerRef, static: false}) public moretab: ViewContainerRef;

    public currenttab: string = '';
    public tabs: any[] = [];
    public resizeListener: any;
    public moreOpen: boolean = false;
    public moreModules: string[] = [];

    constructor(public model: model, public language: language, public activitiytimeline: activitiytimeline, public metadata: metadata, public elementRef: ElementRef, public renderer: Renderer2) {
        this.resizeListener = this.renderer.listen('window', 'resize', e => {
            this.handleOverflow();
        });
    }


    public ngOnInit() {
        let config = this.metadata.getComponentConfig('ActivityTimelineAddContainer', this.model.module);
        if (config && config.componentset) {
            let componentsetComponents = this.metadata.getComponentSetObjects(config.componentset);
            for (let componentsetComponent of componentsetComponents) {
                // check if we have erdit right on the module
                if (componentsetComponent.componentconfig.module && this.metadata.checkModuleAcl(componentsetComponent.componentconfig.module, 'create')) {
                    this.tabs.push({
                        module: componentsetComponent.componentconfig.module,
                        component: componentsetComponent.component,
                        componentconfig: componentsetComponent.componentconfig
                    });
                }
            }
            this.currenttab = this.tabs[0].module;
        } else if (config && config.tabs && config.tabs.length > 0) {
            this.tabs = config.tabs;
            this.currenttab = config.tabs[0].module;
        }
    }

    public ngAfterViewInit(): void {
        this.handleOverflow();
    }

    public ngOnDestroy(): void {
        this.resizeListener();
    }

    public handleOverflow() {
        this.moreModules = [];
        // make sure we set all to hidden
        this.maintabs.forEach(thisitem => {
            thisitem.element.nativeElement.classList.remove('slds-hide');
            thisitem.element.nativeElement.classList.add('slds-hidden');
        });
        this.moretab.element.nativeElement.classList.add('slds-hidden');
        this.moretab.element.nativeElement.classList.remove('slds-hide');

        // get the total width and the more tab with
        let totalwidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        let morewidth = this.moretab.element.nativeElement.getBoundingClientRect().width;
        let showmore = false;

        let usedWidth = 0;
        this.maintabs.forEach((thisitem, itemindex) => {
            let itemwidth = thisitem.element.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (usedWidth > totalwidth - morewidth) {
                // special handling for last element
                if (showmore || itemindex + 1 < this.maintabs.length || itemwidth > morewidth) {
                    thisitem.element.nativeElement.classList.add('slds-hide');
                    this.moreModules.push(thisitem.element.nativeElement.attributes.getNamedItem('data-module').value);
                    showmore = true;
                }
            }
            thisitem.element.nativeElement.classList.remove('slds-hidden');
        });

        // handle the more element hidden attribute
        if (showmore) {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');

            this.moretabs.forEach(moreitem => {
                if (this.moreModules.indexOf(moreitem.element.nativeElement.attributes.getNamedItem('data-module').value) >= 0) {
                    moreitem.element.nativeElement.classList.remove('slds-hide');
                } else {
                    moreitem.element.nativeElement.classList.add('slds-hide');
                }
            });

        } else {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');
            this.moretab.element.nativeElement.classList.add('slds-hide');
        }

    }

    public setTab(object) {
        this.currenttab = object;
    }

    public checkTab(object) {
        return this.currenttab == object;
    }

    get moreactive() {
        return this.moreModules.indexOf(this.currenttab) >= 0;
    }

    public tabClass(object) {
        return this.currenttab == object.module ? 'slds-show' : 'slds-hide';
    }

    public toggleOpen() {
        this.moreOpen = !this.moreOpen;
    }
}
