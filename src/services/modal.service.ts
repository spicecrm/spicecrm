/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module services
 */
import {EventEmitter, Injectable, Injector} from "@angular/core";
import {metadata} from "./metadata.service";
import {Observable, Subject, of} from "rxjs";
import {footer} from "./footer.service";
import {toast} from "./toast.service";
import {language} from "./language.service";

/**
 * handles the modals in the system
 */
@Injectable()
export class modal {

    /**
     * keeps an array of modals that are currently open
     */
    private modalsArray: any[] = [];

    /**
     * keeps an array of the objects rendered as modals
     */
    private modalsObject = {};

    constructor(private metadata: metadata, private footer: footer, private toast: toast, private language: language) {
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 27 && this.modalsArray.length) {
                event.stopImmediatePropagation();
                let wrapperComponent = this.modalsArray[this.modalsArray.length - 1].wrapper;
                if (wrapperComponent.instance.escKey && (!wrapperComponent.instance.childComponent.instance.onModalEscX || wrapperComponent.instance.childComponent.instance.onModalEscX() !== false)) {
                    wrapperComponent.destroy();
                }
            }
        });
    }

    /*
    * tries to open a modal and if the component is not found or no componentfactory is found returns an error as the subject and prompts a toast.
    */
    public openModal(componentName, escKey = true, injector?: Injector, blurBackdrop?: boolean) {
        // SPICEUI-35
        if (this.metadata.checkComponent(componentName)) {
            let retSubjectXY = new Subject<any>();
            this.metadata.addComponentDirect("SystemModalWrapper", this.footer.modalcontainer).subscribe(wrapperComponent => {
                let newModal: any = {};
                newModal.wrapper = wrapperComponent;
                newModal.blurBackdrop = blurBackdrop;
                wrapperComponent.instance.escKey = escKey;
                this.modalsArray.push(newModal);
                this.modalsObject[newModal.modalId] = newModal;
                this.metadata.addComponentDirect(componentName, wrapperComponent.instance.target, injector).subscribe(
                    component => {
                        component.instance.self = wrapperComponent;
                        newModal.component = component;
                        wrapperComponent.instance.childComponent = component;
                        retSubjectXY.next(component);
                        retSubjectXY.complete();
                    },
                    e => {
                        // remove the wrapper
                        this.removeModal(wrapperComponent);
                        // send a toast
                        this.sendError(componentName);
                        retSubjectXY.error(e);
                        retSubjectXY.complete();
                    });
                wrapperComponent.instance.zIndex = this.modalsArray.length * 2 + 1;
            });
            return retSubjectXY.asObservable();
        } else {
            this.sendError(componentName);
            return of(false);
        }
    }



    /**
     * sends an error toast if the modal compopnent that shoudk be rendered is not defined int he repository
     *
     * @param componentName the name of the component hat was intended to be rendered in the modal
     */
    private sendError(componentName) {
        this.toast.sendToast('Component "' + componentName + '" not found.', "error", "Misconfiguration on the system as the component should have been opened in a modal but is not available. Please contact your system administrator.");
    }

    /**
     * Removes a modal from the modals array.
     *
     * @param modalToClose the modal that shoudl be removed from the stack of modals
     */
    public removeModal(modalToClose) { // modalToClose is a reference to angular component
        for (let i = 0; i < this.modalsArray.length; i++) {
            if (this.modalsArray[i].wrapper === modalToClose) {
                this.modalsArray.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Destroys the modal wrapper component. Thereby ngOnDestroy() of the modal wrapper component will be triggered and this will call removeModal()
     *
     * @param modalToClose the modal that should be removed from the stack of modals
     */
    public closeModal(modalToClose) { // modalToClose can be the index in the modal array or the reference to the wrapper component
        if (typeof modalToClose === "number") {
            if (this.modalsArray[modalToClose]) {
                this.modalsArray[modalToClose].wrapper.destroy();
            }
        } else {
            for (let i = 0; i < this.modalsArray.length; i++) {
                if (this.modalsArray[i].wrapper === modalToClose) {
                    this.modalsArray.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * close all open modals
     */
    public closeAllModals() {
        for (let i = this.modalsArray.length - 1; i >= 0; i--) {
            this.modalsArray[i].wrapper.destroy();
        }
    }

    /**
     * a simple getter to check if the backdrop shoudl be displayed
     */
    get backdropVisible() {
        return this.modalsArray.length !== 0;
    }

    /**
     * a simple getter to get the z-index for the backdrop. The backdrop shoudl alwys be rendered right underneath the last visible modal int eh stack
     */
    get backdropZindex() {
        return this.modalsArray.length * 2;
    }

    /**
     * returns a style for the last backdrop
     * used to blur a backdrop if the user is logged out
     */
    get backdropBlurred() {
        if (this.modalsArray.length > 0 && this.modalsArray[this.modalsArray.length - 1].blurBackdrop === true) {
            return 'blur(4px)';
        }
        return 'none';
    }

    /**
     * prompts a dialog
     *
     * @param type the type of the prompts
     * @param text the text in the prompts
     * @param headertext the text for the header
     * @param theme a theme as per slds definition
     * @param defaultvalue ??
     * @param options options to be presented to the user
     * @param optionsAsRadio
     */
    public prompt(type: 'info' | 'input' | 'confirm', text: string, headertext: string = null, theme: string = 'shade', defaultvalue: string | number = null, options: Array<{ value: string, display: string }> = null, optionsAsRadio?: boolean): Observable<any> {
        let responseSubject = new Subject();
        this.openModal("SystemPrompt").subscribe(component => {
            component.instance.type = type;
            component.instance.text = text;
            component.instance.headertext = headertext;
            component.instance.theme = theme;
            component.instance.value = defaultvalue;
            component.instance.options = options;
            component.instance.optionsAsRadio = optionsAsRadio;
            component.instance.answer.subscribe(answervalue => {
                responseSubject.next(answervalue); // return the answer
                responseSubject.complete();
            });
        });
        return responseSubject.asObservable();
    }

    /**
     * a shortcut to prompt for a confirm dialog
     *
     * @param text
     * @param headertext
     * @param theme
     */
    public confirm(text: string, headertext: string = null, theme: string = null): Observable<any> {
        return this.prompt('confirm', text, headertext, theme);
    }

    /**
     * a shortcut to prompt for a confirm to delete Record dialog
     *
     * @param text
     * @param headertext
     * @param theme
     */
    public confirmDeleteRecord(): Observable<any> {
        return this.prompt('confirm', this.language.getLabel('LBL_DELETE_RECORD', '', 'long'), this.language.getLabel('LBL_DELETE_RECORD'));
    }

    /**
     * a shortcut to prompt for an input dialog
     *
     * @param text
     * @param headertext
     * @param defaultvalue
     * @param theme
     */
    public input(text: string, headertext: string = null, theme: string = null, defaultvalue: string = null): Observable<any> {
        return this.prompt('input', text, headertext, theme, defaultvalue);
    }

    /**
     * a shortcut to prompt for an info dialog
     *
     * @param text
     * @param headertext
     * @param theme
     */
    public info(text: string, headertext: string = null, theme: string = null): Observable<any> {
        return this.prompt('info', text, headertext, theme);
    }

    /**
     * renders a loading modal if the user is supposed to wait until an async operation completes
     *
     * @param messagelabel
     */
    public await(messagelabel: string = null): EventEmitter<boolean> {
        let stopper = new EventEmitter<boolean>();
        this.openModal('SystemLoadingModal', false).subscribe(component => {
            component.instance.messagelabel = messagelabel;
            stopper.subscribe(() => {
                component.instance.self.destroy();
            });
        });
        return stopper;
    }

}
