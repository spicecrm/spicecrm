/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value
 */
@Component({
    templateUrl: '../templates/reporterfieldinteger.html',
})
export class ReporterFieldInteger  {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};

}
