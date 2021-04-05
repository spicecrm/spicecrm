/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module AddComponentsModule
 */
import {
    Component,
    Input,
    ElementRef
} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: '[spice-timestream-item]',
    templateUrl: './src/addcomponents/templates/spicetimestreamitem.html'
})
export class SpiceTimestreamItem{

    @Input()timestream: any = {};
    @Input() elementstart: any = {};
    @Input() elementend: any = {};


    constructor(private elementRef: ElementRef, private userpreferences: userpreferences) {

    }

    get displayItem(){
        return this.elementstart && this.elementend && this.elementstart.isBefore(this.elementend) &&  this.elementstart.isBefore(this.timestream.dateEnd) && this.elementend.isAfter(this.timestream.dateStart);
    }

    get startdate(){
        return this.elementstart.isBefore(this.timestream.dateStart) ? this.timestream.dateStart : this.elementstart;
    }

    get enddate(){
        return this.elementend.isAfter(this.timestream.dateEnd) ? this.timestream.dateEnd : this.elementend;
    }

    getStart(){
        let totaldays = this.timestream.dateEnd.diff(this.timestream.dateStart, 'days');
        let startOffset = this.startdate.diff(this.timestream.dateStart, 'days');
        return startOffset / totaldays * 100;
    }

    getWidth(){
        let totaldays = this.timestream.dateEnd.diff(this.timestream.dateStart, 'days');
        let length = this.enddate.diff(this.startdate, 'days');
        return length / totaldays * 100;
    }

    getElementStyle(){
        return{
            left: this.getStart() + '%',
            width: this.getWidth() + '%'
        }
    }
}
