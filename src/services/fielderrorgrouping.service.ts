/**
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class fielderrorgrouping {

    fieldsWithErrors = {};
    nrErrorsFields = 0;
    change$ = new EventEmitter();

    constructor() { }

    setError( fieldname: string, error: boolean ) {
        let changed = false;
        if ( error ) {
            if ( !this.fieldsWithErrors[fieldname] ) {
                this.fieldsWithErrors[fieldname] = true;
                this.nrErrorsFields++;
                changed = true;
            }
        } else {
            if ( this.fieldsWithErrors[fieldname] ) {
                delete this.fieldsWithErrors[fieldname];
                this.nrErrorsFields--;
                changed = true;
            }
        }
        if ( changed ) this.change$.emit( this.nrErrorsFields );
    }

    hasErrors(): number|false {
        return this.nrErrorsFields || false;
    }

}
