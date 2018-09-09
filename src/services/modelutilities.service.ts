import {Injectable} from '@angular/core';
import {metadata} from './metadata.service';
import {MathExpressionCompilerService} from "./mathexpressioncompiler";

declare var moment: any;
moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';

@Injectable()
export class modelutilities
{

    constructor(
        private metadata: metadata,
        private mathcomp: MathExpressionCompilerService
    ) {

    }

    /*
     * for the GUID Generation
     */
    private getRand() {
        return Math.random();
    }

    private S4() {
        return (((1 + this.getRand()) * 0x10000) | 0).toString(16).substring(1);
    }

    generateGuid() {
        return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4());
    }

    /*
     Data transition functions
     */
    backendModel2spice(module: string, modelData: any) {
        let moduleFields = this.metadata.getModuleFields(module);
        for (let field in moduleFields) {
            if (modelData[field]) {
                modelData[field] = this.backend2spice(module, field, modelData[field]);
            }
        }
        return modelData;
    }

    backend2spice(module: string, field: string, value: any) {
        switch (this.metadata.getFieldType(module, field)) {
            case 'date':
                // return new Date(Date.parse(value));
                let pDate = moment.utc(value);
                return pDate;
            case 'datetime':
            case 'datetimecombo':
                // return new Date(Date.parse(value));
                let pDateTime = moment(value).tz(moment.tz.guess());
                pDateTime.add(pDateTime.utcOffset(), 'm');
                return pDateTime;
            case 'double':
            case 'currency':
                return value ? parseFloat(value) : 0;
            case 'int':
                return value ? parseInt(value) : 0;
            case 'bool':
            case 'boolean':
                return value == '1' || value > 0 || value == true ? true : false;
            case 'json':
                try
                {
                    return value ? JSON.parse(value) : {};
                }
                catch(e)
                {
                    console.error('Could not parse this value as json:', value);
                    return {};
                }
            //todo: type mutlienum!
            default:
                return value;
        }
    }

    spiceModel2backend(module: string, modelData: any) {
        let moduleFields = this.metadata.getModuleFields(module);
        for (let field in moduleFields) {
            if (modelData[field]) {
                modelData[field] = this.spice2backend(module, field, modelData[field]);
            }
        }
        return modelData;
    }

    spice2backend(module: string, field: string, value: any)
    {
        if(!value)
            return value;

        switch(this.metadata.getFieldType(module, field)) {
            case 'date':
                if(value._isAMomentObject){
                    return value.format('YYYY-MM-DD');
                } else {
                    let pDate = new moment.utc(value);
                    return pDate.format('YYYY-MM-DD');
                }
            case 'datetime':
            case 'datetimecombo':
                let pDateTime = new moment(value).tz(moment.tz.guess());
                pDateTime.subtract(pDateTime.utcOffset(), 'm');
                return pDateTime.format('YYYY-MM-DD HH:mm:ss');
            // return value.getUTCFullYear() + '-' + value.getUTCMonth() + '-' + (value.getUTCDate() < 10 ? '0' + value.getUTCDate() : value.getUTCDate()) + ' ' + value.getUTCHours() + ':' + value.getUTCMinutes() + ':' + value.getUTCSeconds();
            case 'json':
                return JSON.stringify(value);
            //todo: type mutlienum!
            default:
                return value;
        }
    }

    formatDate = function (d) {
        return moment(d).format('YYYY-MM-DD');
    };

    /*
     * a method to normilzae and clean an account name
     */
    cleanAccountName(name) {
        let companyNames = ['ag', 'gmbh', 'gesmbh', 'corp', 'inc'];
        let newname = name.toLowerCase();
        newname = newname.replace(/[^\w\s]/gi, '');
        let nameArray = newname.split(' ');
        for (let companyName of companyNames) {
            let nameIndex = nameArray.indexOf(companyName);
            if (nameIndex >= 0)
                nameArray.splice(nameIndex, 1);
        }
        return nameArray.join(' ');
    }

    /**
     * compares 2 given values dynamically with given comparator
     * @param val1
     * @param comparator
     * @param val2
     * @returns {boolean}
     */
    static compare(val1, comparator:string, val2):boolean
    {
        switch(comparator)
        {
            case 'in':
                // do something
                break;
            case 'between':
                // do something
                break;
            case 'contain':
                return (val1.indexOf(val2) !== -1);
            case 'greaterequal':
                return (val1 >= val2);
            case 'greater':
                return (val1 > val2);
            case 'lesserequal':
                return (val1 <= val2);
            case 'lesser':
                return (val1 < val2);
            case 'unequal':
                return (val1 != val2);
            case 'equal':
            default:
                return (val1 == val2);
        }
    }

    /**
     * converts a given string to a boolean, like it happens in php on boolean casts
     * feel free to add cases or regexp!
     * @param {string} str
     * @returns {boolean}
     */
    static strtobool(str:string):boolean
    {
        switch(str.toLowerCase().trim())
        {
            case "false": case "no": case "0": case "": return false;
            default: return true;
        }
    }

    /**
     * uses strtotime to convert a date/time string to an moment object
     * @param   {string}    text    a date/time string.
     * @param   {number}    now     the timestamp which is used as a base for the calculation of relative dates.
     * @returns {moment}
     */
    static strtomoment(text:string, now?:number)
    {
        return moment(modelutilities.strtotime(text,now),'X');
    }

    /**
     * converts any given string to a time, represented in a number of seconds!
     * every combination of notations are allowed as described here: http://php.net/manual/en/function.strtotime.php
     * source: http://locutus.io/php/datetime/strtotime/
     * @param {string}  text    a date/time string.
     * @param {number}  now     the timestamp which is used as a base for the calculation of relative dates.
     * @returns     {number}    a number of seconds (timestamp)
     */
    static strtotime(text:string, now?:number)
    {
        var parsed;
        var match;
        var today;
        var year;
        var date;
        var days;
        var ranges;
        var len;
        var times;
        var regex;
        var i;
        var fail = false;
        if (!text) {
            return fail
        }
        // Unecessary spaces
        text = text.replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();
        // in contrast to php, js Date.parse function interprets:
        // dates given as yyyy-mm-dd as in timezone: UTC,
        // dates with "." or "-" as MDY instead of DMY
        // dates with two-digit years differently
        // etc...etc...
        // ...therefore we manually parse lots of common date formats
        var pattern = new RegExp([
            '^(\\d{1,4})',
            '([\\-\\.\\/:])',
            '(\\d{1,2})',
            '([\\-\\.\\/:])',
            '(\\d{1,4})',
            '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
            '(?:\\s([A-Z]+)?)?$'
        ].join(''));
        match = text.match(pattern);
        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                    case '-':
                        // YYYY-M-D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail
                        }
                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                    case '.':
                        // YYYY.M.D is not parsed by strtotime()
                        return fail;
                    case '/':
                        // YYYY/M/D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail
                        }
                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                }
            } else if (match[5] > 1901) {
                switch (match[2]) {
                    case '-':
                        // D-M-YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail
                        }
                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                    case '.':
                        // D.M.YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail
                        }
                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                    case '/':
                        // M/D/YYYY
                        if (match[1] > 12 || match[3] > 31) {
                            return fail;
                        }
                        return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                }
            } else {
                switch (match[2]) {
                    case '-':
                        // YY-M-D
                        if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                            return fail
                        }
                        year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                        return new Date(year, parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                    case '.':
                        // D.M.YY or H.MM.SS
                        if (match[5] >= 70) {
                            // D.M.YY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }
                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                        }
                        if (match[5] < 60 && !match[6]) {
                            // H.MM.SS
                            if (match[1] > 23 || match[3] > 59) {
                                return fail
                            }
                            today = new Date();
                            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0).getTime() / 1000;
                        }
                        // invalid format, cannot be parsed
                        return fail;
                    case '/':
                        // M/D/YY
                        if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                            return fail
                        }
                        year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                        return new Date(year, parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0).getTime() / 1000;
                    case ':':
                        // HH:MM:SS
                        if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                            return fail
                        }
                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0).getTime() / 1000;
                }
            }
        }
        // other formats and "now" should be parsed by Date.parse()
        if (text === 'now') {
            return now === null || isNaN(now)
                ? new Date().getTime() / 1000 | 0
                : now | 0
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0
        }
        // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
        // not accept lower case characters, space, or shortened time zones.
        // Therefore, fix these problems and try again.
        // Examples:
        //   2015-04-15 20:33:59+02
        //   2015-04-15 20:33:59z
        //   2015-04-15t20:33:59+02:00
        pattern = new RegExp([
            '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
            '[ t]',
            '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
            '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
        ].join(''));
        match = text.match(pattern);
        if (match) {
            // @todo: time zone information
            if (match[4] === 'z') {
                match[4] = 'Z'
            } else if (match[4].match(/^([+-][0-9]{2})$/)) {
                match[4] = match[4] + ':00'
            }
            if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
                return parsed / 1000 | 0
            }
        }
        date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };
        function lastNext (type, range, modifier) {
            var diff;
            var day = days[range];
            if (typeof day !== 'undefined') {
                diff = day - date.getDay();
                if (diff === 0) {
                    diff = 7 * modifier
                } else if (diff > 0 && type === 'last') {
                    diff -= 7
                } else if (diff < 0 && type === 'next') {
                    diff += 7
                }
                date.setDate(date.getDate() + diff)
            }
        }
        function process (val) {
            // @todo: Reconcile this with regex using \s, taking into account
            // browser issues with split and regexes
            var splt = val.split(' ');
            var type = splt[0];
            var range = splt[1].substring(0, 3);
            var typeIsNumber = /\d+/.test(type);
            var ago = splt[2] === 'ago';
            var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);
            if (typeIsNumber) {
                num *= parseInt(type, 10)
            }
            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return date['set' + ranges[range]](date['get' + ranges[range]]() + num)
            }
            if (range === 'wee') {
                return date.setDate(date.getDate() + (num * 7))
            }
            if (type === 'next' || type === 'last') {
                lastNext(type, range, num)
            } else if (!typeIsNumber) {
                return false
            }
            return true
        }
        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';
        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail
        }
        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail
            }
        }
        return (date.getTime() / 1000)
    }

    /**
     * converts an array/object into a query string
     * source: http://locutus.io/php/url/http_build_query/
     * @param formdata is an array of parameters
     * @param numericPrefix
     * @param argSeparator is a string used to seperate the arguments, by default it is '&'
     * @returns {string}
     */
    http_build_query(formdata, numericPrefix:string = '', argSeparator:string = '&'):string
    {
        //let urlencode = require('../url/urlencode');
        let value;
        let key;
        let tmp = [];
        let _httpBuildQueryHelper = function (key, val, argSeparator) {
            let k;
            let tmp = [];
            if (val === true) {
                val = '1'
            } else if (val === false) {
                val = '0'
            }
            if (val !== null) {
                if (typeof val === 'object') {
                    for (let k in val) {
                        if (val[k] !== null) {
                            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator));
                        }
                    }
                    return tmp.join(argSeparator);
                } else if (typeof val !== 'function') {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
                } else {
                    throw new Error('There was an error processing for http_build_query().');
                }
            } else {
                return ''
            }
        };
        if (!argSeparator) {
            argSeparator = '&';
        }
        for (let key in formdata) {
            let value = formdata[key];
            if (numericPrefix && !isNaN(parseFloat(key))) {
                key = String(numericPrefix) + key;
            }
            let query = _httpBuildQueryHelper(key, value, argSeparator);
            if (query !== '') {
                tmp.push(query);
            }
        }
        return tmp.join(argSeparator);
    }

    compileMathExpression(code)
    {
        //console.log('compiling: '+code+' ...');
        try{
            return this.mathcomp.do(code);
        }
        catch(e)
        {
            console.warn(e);
            return false;
        }
    }
}
