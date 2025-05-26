import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ObjectActionEditButton} from "../../../objectcomponents/components/objectactioneditbutton";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'calendar-edit-button',
    templateUrl: '../templates/calendareditbutton.html',
    standalone: false
})

export class CalendarEditButton extends ObjectActionEditButton {
    /**
     * modal service instance
     * @private
     */
    private modal: modal = inject(modal);
    private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

    /**
     * reload the bean data before editing
     */
    public execute(): void {
        const loading = this.modal.await('LBL_LOADING');
        this.model.getData(true).subscribe(() => {
            this.cdRef.markForCheck();
            super.execute();
            loading.next(true);
            loading.complete();
        });
    }
}