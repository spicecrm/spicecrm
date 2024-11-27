/**
 * @module ModuleTravels
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';
import {Router} from '@angular/router';
import {view} from '../../../services/view.service';

declare var moment: any;
declare var _: any;

/**
 * renders a bullet, in slds success color or grey, depending on the boolean value of the field
 */
@Component({
    templateUrl: '../templates/fieldtravelallowancedeductions.html',
})
export class fieldTravelAllowanceDeductions extends fieldGeneric {

    public deductions: {date: string, b:boolean, l:boolean, d:boolean}[] = undefined;

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super( model, view, language, metadata, router );
    }

    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe({
                next: (data) => {
                    this.buildDays(data);
                }
            })
        )
    }

    get editing(){
        return this.isEditable() && this.isEditMode();
    }

    public writeValue(){
        this.value = [...this.deductions]
    }

    private buildDays(data){
        if(!this.deductions && this.value && !_.isEmpty(this.value)){
            this.deductions = this.value;
        }

        if(this.editing && data.date_start && data.date_end){
            if(!this.deductions || this.deductions.length == 0 || (data.date_start.dayOfYear() != moment(this.deductions[0].date).dayOfYear() || data.date_end.dayOfYear() != moment(this.deductions[this.deductions.length - 1].date).dayOfYear())){
                let deductionsBackup = this.deductions ? [...this.deductions] : [];
                this.deductions = [];
                let date = moment(data.date_start);
                while(date.dayOfYear() <= data.date_end.dayOfYear()) {
                    let db = deductionsBackup.find(d => d.date == date.format('YYYY-MM-DD'));
                    if(db){
                        this.deductions.push({...db});
                    } else {
                        this.deductions.push({
                            date: date.format('YYYY-MM-DD'),
                            b: false,
                            l: false,
                            d: false
                        });
                    }
                    date.add(1, 'd');
                }
            }
        }
    }

}
