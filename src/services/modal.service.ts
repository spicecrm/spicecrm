import { EventEmitter, Injectable, Injector } from "@angular/core";
import {metadata} from "./metadata.service";
import {Observable, Subject, of} from "rxjs";
import {footer} from "./footer.service";
import {toast} from "./toast.service";
import {modelutilities} from "./modelutilities.service";

@Injectable()
export class modal {

    private modalsArray: Array<any> = [];
    private modalsObject: Object = {};

    constructor(private metadata: metadata, private footer: footer, private toast: toast, private utils: modelutilities) {
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 27 && this.modalsArray.length) {
                let wrapperComponent = this.modalsArray[this.modalsArray.length - 1].wrapper;
                if (wrapperComponent.instance.escKey && (!wrapperComponent.instance.childComponent.instance.onModalEscX || wrapperComponent.instance.childComponent.instance.onModalEscX() !== false)) {
                    wrapperComponent.destroy();
                }
            }
        });
    }

    /*
    * tries to oopen a modal and if the component is not found or no componentfactory is found returns an erro as the subject and prompts a toast.
    */
    public openModal(componentName, escKey = true, injector?: Injector) {
        // SPICEUI-35
        if (this.metadata.checkComponent(componentName)) {
            let retSubjectXY = new Subject<any>();
            this.metadata.addComponentDirect("SystemModalWrapper", this.footer.modalcontainer).subscribe(wrapperComponent => {
                let newModal = <any> {};
                newModal.wrapper = wrapperComponent;
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

    private sendError(componentName) {
        this.toast.sendToast('Component "' + componentName + '" not found.', "error", "Misconfiguration on the system as the component should have been opened in a modal but is not avilable. Please contact your system administrator.");
    }

    // Removes a modal from the modals array.
    public removeModal(modalToClose) { // modalToClose is a reference to angular component
        for (let i = 0; i < this.modalsArray.length; i++) {
            if (this.modalsArray[i].wrapper === modalToClose) {
                this.modalsArray.splice(i, 1);
                break;
            }
        }
    }

    // Destroys the modal wrapper component. Thereby ngOnDestroy() of the modal wrapper component will be triggered and this will call removeModal().
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

    public closeAllModals() {
        for (let i = this.modalsArray.length - 1; i >= 0; i--) {
            this.modalsArray[i].wrapper.destroy();
        }
    }

    get backdropVisible() {
        return this.modalsArray.length !== 0;
    }

    get backdropZindex() {
        return this.modalsArray.length * 2;
    }

    public prompt(type: string, text: string, headertext: string = null, theme: string, defaultvalue: string = null): Observable<any> {
        let responseSubject = new Subject();
        this.openModal("SystemPrompt").subscribe(component => {
            // todo: abhängig von type: esc ein/aus via component.instance["wrapper"]
            component.instance.type = type;
            component.instance.text = text;
            component.instance.headertext = headertext;
            component.instance.theme = theme;
            component.instance.defaultvalue = defaultvalue;
            component.instance.answer.subscribe(answervalue => {
                responseSubject.next(answervalue); // return the answer
                responseSubject.complete();
            });
        });
        return responseSubject.asObservable();
    }

    public confirm(text: string, headertext: string = null, theme: string = null): Observable<any> {
        return this.prompt("confirm", text, headertext, theme);
    }

    public input(text: string, headertext: string = null, defaultvalue: string = null, theme: string = null): Observable<any> {
        return this.prompt("input", text, headertext, defaultvalue, theme);
    }

    public info(text: string, headertext: string = null, theme: string = null): Observable<any> {
        return this.prompt("info", text, headertext, theme);
    }

    public await( messagelabel: string = null ): EventEmitter<boolean> {
        let stopper = new EventEmitter<boolean>();
        this.openModal("SystemLoadingModal").subscribe(component => {
            component.instance.messagelabel = messagelabel;
            stopper.subscribe( () => {
                component.instance.self.destroy();
            });
        });
        return stopper;
    }

}