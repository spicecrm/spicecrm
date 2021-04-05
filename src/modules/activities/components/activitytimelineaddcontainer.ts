/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/activities/templates/activitytimelineaddcontainer.html'
})
export class ActivityTimelineAddContainer implements OnInit, AfterViewInit, OnDestroy {

    @ViewChildren('maintabs', {read: ViewContainerRef}) private maintabs: QueryList<any>;
    @ViewChildren('moretabs', {read: ViewContainerRef}) private moretabs: QueryList<any>;
    @ViewChild('moretab', {read: ViewContainerRef, static: false}) private moretab: ViewContainerRef;

    private currenttab: string = '';
    private tabs: any[] = [];
    private resizeListener: any;
    private moreOpen: boolean = false;
    private moreModules: string[] = [];

    constructor(private model: model, private language: language, private activitiytimeline: activitiytimeline, private metadata: metadata, private elementRef: ElementRef, private renderer: Renderer2) {
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
                if (componentsetComponent.componentconfig.module && this.metadata.checkModuleAcl(componentsetComponent.componentconfig.module, 'edit')) {
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

    private handleOverflow() {
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

    private setTab(object) {
        this.currenttab = object;
    }

    private checkTab(object) {
        return this.currenttab == object;
    }

    get moreactive() {
        return this.moreModules.indexOf(this.currenttab) >= 0;
    }

    private tabClass(object) {
        return this.currenttab == object.module ? 'slds-show' : 'slds-hide';
    }

    private toggleOpen() {
        this.moreOpen = !this.moreOpen;
    }
}
