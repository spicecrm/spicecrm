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
 * @module ModuleProducts
 */
import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-text-generator',
    templateUrl: './src/modules/products/templates/producttextgenerator.html'
})
export class ProductTextGenerator {

    private componentSubscriptions: any[] = [];
    private attributes: any = {};
    private ltattributes: any = {};
    private productnames: any[] = [];
    private attributesproductid: string = '';
    private loading: boolean = false;
    private tableguid: string = '';
    private isOpen: boolean = true;
    private E1: string = '';
    private E2: string = '';
    private Q: string = '';

    private textElements = {
        MGST: '',
        E1: '',
        E2: '',
        Q: '',
        F: '',
        A: '',
        S: '',
    };
    private textTemplateDef = [
        {
            source: 'MGST',
            len: 6
        },
        {
            source: 'E1',
            len: 4
        },
        {
            source: 'E2',
            len: 4
        },
        {
            source: 'Q',
            len: 4
        },
        {
            source: 'F',
            len: 4
        },
        {
            source: 'A',
            len: 15
        },
        {
            source: 'S',
            len: 3
        },
    ];
    private textTemplate: string = 'MGST:1:6::E1:7:10::E2:11:14::Q:15:18::F:19:22::A:23:37::S:38:40';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private view: view) {
        this.componentSubscriptions.push(model.data$.subscribe(event => {
                this.loadAttributes();
            })
        );

        this.tableguid = this.model.generateGuid();
    }

    get e1() {
        return this.textElements.E1;
    }

    set e1(value) {
        this.textElements.E1 = value;
    }

    get productText() {
        let producttext = '';
        for (let textElement of this.textTemplateDef) {
            let element = '';
            switch (textElement.source) {
                case 'E1':
                case 'E2':
                case 'Q':
                    if (this.textElements[textElement.source]) {
                        element = this.getAttributeValue(this.textElements[textElement.source]);

                        // handle specific datatypes
                        switch (this.attributes[this.textElements[textElement.source]].prat_datatype) {
                            case 'N':
                                element = element.toString();
                                while (element.length < 4) {
                                    element = '0' + element;
                                }
                                break;
                            case 'S':
                            case 'D':
                                element = this.translateAttribValue(this.textElements[textElement.source], element);
                                break;
                        }
                    }
                    break;
                case 'F':
                    for (let attrib in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrib) && this.attributes[attrib].contentcode == 'F') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if (this.attributes[attrib].contentcode2 == 'D' && attribvalue) {
                                element = 'DRUC';
                            } else if (attribvalue && element === '') {
                                element = this.translateAttribValue(attrib, attribvalue);
                            }
                        }
                    }
                    break;
                case 'A':
                    let dimAttribs = [];

                    // get all attribs
                    for (let attrib in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrib) && this.attributes[attrib].contentcode == 'A') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if (attribvalue) {
                                switch (this.attributes[attrib].prat_datatype) {
                                    case 'N':
                                        attribvalue = attribvalue.toString();
                                        while (attribvalue.length < 4) {
                                            attribvalue = '0' + attribvalue;
                                        }
                                        break;
                                    case 'S':
                                    case 'D':
                                        attribvalue = this.translateAttribValue(attrib, attribvalue);
                                        break;
                                }
                                dimAttribs.push({
                                    position: this.attributes[attrib].contentcode2,
                                    value: (this.attributes[attrib].contentprefix ? this.attributes[attrib].contentprefix : '') + attribvalue
                                });
                            }
                        }
                    }

                    // sort the attribs by sequence
                    dimAttribs.sort((a, b) => {
                        return a.position > b.position ? 1 : -1;
                    });

                    // buiol the text element
                    for (let attrib of dimAttribs) {
                        element += attrib.value;
                    }

                    break;
                default:
                    element = this.textElements[textElement.source];
                    break;
            }

            // fill value up with slashes
            if (element.length == textElement.len) {
                producttext += element;
            } else if (element.length > textElement.len) {
                producttext += element.substr(0, textElement.len);
            } else {
                while (element.length < textElement.len) {
                    element += '/';
                }
                producttext += element;
            }

        }

        return producttext;
    }

    get longText() {
        let longtext = '';

        for (let attrib of this.ltattributes) {
            let attribvalue = this.getAttributeValue(attrib.id);
            if (attribvalue != '') {
                longtext += attrib.textpattern.replace('[value]', attribvalue) + '\n';
            }
        }

        return longtext;
    }

    public ngOnInit() {
        this.loadAttributes();
    }

    public ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    private loadAttributes() {
        if (this.model.data.product_id && this.model.data.product_id !== this.attributesproductid) {
            this.loading = true;
            this.attributesproductid = this.model.data.product_id;
            this.backend.getRequest('products/' + this.model.data.product_id + '/productattributes/textgenerator').subscribe((response: any) => {
                this.attributes = response.attributes;
                this.ltattributes = response.ltattributes;
                this.productnames = response.productnames;
                this.textElements.MGST = response.shorttext.substr(6, 6);
                this.loading = false;
            });
        } else if (!this.model.data.product_id) {
            this.attributes = [];
        }
    }

    private translateAttribValue(attrib, value) {
        if (this.attributes[attrib].values && this.attributes[attrib].values[value]) {
            return this.attributes[attrib].values[value];
        } else {
            return value;
        }
    }

    private togglerequired() {
        this.isOpen = !this.isOpen;
    }

    private getOpenStyle() {
        if (!this.isOpen) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    private getAttributeValue(attributeid) {
        let value = '';
        let beans = this.model.data.productattributevalues.beans;
        try {
            for (let attrib in beans) {
                if (beans.hasOwnProperty(attrib) && beans[attrib].productattribute_id == attributeid) {
                    return beans[attrib].pratvalue;
                }
            }
        } catch (e) {
            return '';
        }

        return value;
    }

    private getvalues(type) {
        let values = [];

        for (let attribute in this.attributes) {
            if (this.attributes.hasOwnProperty(attribute) && this.attributes[attribute].contentcode == type) {
                values.push({
                    id: this.attributes[attribute].id,
                    name: this.attributes[attribute].name
                });
            }
        }

        return values;
    }
}
