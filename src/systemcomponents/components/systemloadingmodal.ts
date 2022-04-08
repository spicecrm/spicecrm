/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: '../templates/systemloadingmodal.html'
})
export class SystemLoadingModal {

    public messagelabel: string = 'LBL_LOADING';

    constructor(public language: language) {

    }
}
