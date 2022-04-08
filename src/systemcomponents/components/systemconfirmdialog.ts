/**
 * @module SystemComponents
 */
import {
    Component
} from '@angular/core';
import {language} from '../../services/language.service';

import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'system-confirm-dialog',
    templateUrl: '../templates/systemconfirmdialog.html',
    styles: [':host { position: relative; z-index: 9100; }']
})
export class SystemConfirmDialog  {

    self: any = {};

    answer: Observable<boolean> = null;
    answerSubject: Subject<boolean> = null;
    title: string = 'title';
    message: string = 'message';

    constructor(public language: language) {
        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();
    }

    ok(){
        this.answerSubject.next(true);
        this.answerSubject.complete();

        // destroiy the modal
        this.self.destroy();
    }

    cancel(){
        this.answerSubject.next(false);
        this.answerSubject.complete();

        // destroy the modal
        this.self.destroy();
    }

}
