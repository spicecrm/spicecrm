import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'system-spinner',
    templateUrl: './src/systemcomponents/templates/systemspinner.html'
})
export class SystemSpinner implements OnInit {

    @Input() private size: number = 0;
    @Input() private border: number = 0;
    @Input() private inverse: string = 'false';

    private spinnerStyle: any = {};

    public ngOnInit() {
        let

            styleObj = {};

        if (this

                .size
            !=
            0
        ) {
            this.spinnerStyle.width = this.size + 'px';
            this.spinnerStyle.height = this.size + 'px';
        }

        if (this.border != 0) {
            this.spinnerStyle['border-width'] = this.border + 'px';
        }

        if (this.inverse == 'true') {
            this.spinnerStyle['border-right-color'] = '#fff';
            this.spinnerStyle['border-left-color'] = '#fff';
            this.spinnerStyle['border-bottom-color'] = '#fff';
        }
        return styleObj;
    }
}
