import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-spinner',
    templateUrl: './src/systemcomponents/templates/systemspinner.html'
})
export class SystemSpinner {

    @Input()size : number = 0;
    @Input()border : number = 0;
    @Input()inverse : string = 'false';


    get spinnerStyle(){
        let styleObj = {};
        if(this.size  != 0){
            styleObj['width'] = this.size + 'px';
            styleObj['height'] = this.size + 'px';
        }
        if(this.border  != 0){
            styleObj['border-width'] = this.border + 'px';
        }

        if(this.inverse == 'true'){
            styleObj['border-right-color'] = '#fff';
            styleObj['border-left-color'] = '#fff';
            styleObj['border-bottom-color'] = '#fff';
        }
        return styleObj;
    }

}