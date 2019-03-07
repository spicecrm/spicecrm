/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/systemcomponents/templates/systemloadingmodal.html'
})
export class SystemLoadingModal {

    private messagelabel: string = 'LBL_LOADING';

    constructor(private language: language) {

    }
}
