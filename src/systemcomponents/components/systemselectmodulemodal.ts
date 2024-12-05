import {Component, ComponentRef, OnDestroy} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {Subject} from "rxjs";

@Component({
    selector: 'system-select-module-modal',
    templateUrl: '../templates/systemselectmodulemodal.html'
})

export class SystemSelectModuleModal implements ModalComponentI, OnDestroy {
    /**
     * emit the selected module when
     */
    public module$ = new Subject<string>();
    /**
     * reference of this component to be destroyed
     */
    public self: ComponentRef<SystemSelectModuleModal>;
    /**
     * the modules to be selected
     */
    public modules: string[] = [];

    /**
     * close the modal and emit false
     */
    public close() {
        this.module$.complete();
        this.self.destroy();
    }

    /**
     * emit the selected module and close the modal
     * @param module
     */
    public save(module) {
        this.module$.next(module);
        this.module$.complete();
        this.self.destroy();
    }

    public ngOnDestroy() {
        this.module$.complete();
    }
}