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
 * @module services
 */
import {
    Injectable,
} from '@angular/core';


/**
 * a service which provides a compiler to evaluate mathematical expressions
 * author: Sebastian Franz
 */
@Injectable()
export class MathExpressionCompilerService {

    /**
     * the main function, it parses the input text and compiles it to return the evaluated math expression
     * @param {string} input a mathematical expression like "12 * 3 + (2 - 1.999)"
     * @returns {string} the compiled result. e.g "36.0001"
     */
    public do(input:string) {
        return this.evaluate(this.parse(this.lex(input)));
    }

    /**
     * only for internal use...
     * @param {string} input
     * @returns {any[]}
     */
    private lex(input: string) {
        let isOperator = (c) => {
            return /[+\-*\/\^%=(),]/.test(c);
        };
        let isDigit = (c) => {
            return /[0-9]/.test(c);
        };
        let isWhiteSpace = (c) => {
            return /\s/.test(c);
        };
        let isIdentifier = (c) => {
            return typeof c === "string" && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c);
        };

        let tokens = [];
        let c;
        let i = 0;
        let advance = () => {
            return c = input[++i];
        };
        let addToken = (type: string, value?) => {
            tokens.push({
                type: type,
                value: value
            });
        };

        while (i < input.length) {
            let c = input[i];
            if (isWhiteSpace(c)) advance();
            else if (isOperator(c)) {
                addToken(c);
                advance();
            } else if (isDigit(c)) {
                let num = '';
                do {
                    num += c;
                    c = advance();
                }
                while (isDigit(c));

                if (c === ".") {
                    do {
                        num += c;
                        c = advance();
                    }
                    while (isDigit(c));
                }
                // console.log(num);
                let parsed_num = parseFloat(num);
                if (!isFinite(parsed_num)) throw "Number is too large or too small for a 64-bit double.";
                addToken("number", parsed_num);
            } else if (isIdentifier(c)) {
                let idn = c;
                while (isIdentifier(advance())) idn += c;
                addToken("identifier", idn);
            } else throw "Unrecognized token: " + c + " at " + i;
        }
        addToken("(end)");
        return tokens;
    }

    /**
     * parses the tokens return from this.lex()
     * @param tokens
     * @returns {any[]}
     */
    private parse(tokens) {

        let symbols = {};
        let symbol = (id, nud?, lbp?, led?) => {
            let sym = symbols[id] || {};
            symbols[id] = {
                lbp: sym.lbp || lbp,
                nud: sym.nud || nud,
                led: sym.led || led
            };
        };

        symbol("(", () => {
            let value = expression(2);
            if (token().type !== ")") throw "Expected closing parenthesis ')'";
            advance();
            return value;
        });
        symbol("number", (number) => {
            return number;
        });
        symbol("identifier", (name) => {
            if (token().type === "(") {
                let args = [];
                if (tokens[i + 1].type === ")") advance();
                else {
                    do {
                        advance();
                        args.push(expression(2));
                    }
                    while (token().type === ",");
                    if (token().type !== ")") throw "Expected closing parenthesis ')'";
                }
                advance();
                return {
                    type: "call",
                    args: args,
                    name: name.value
                };
            }
            return name;
        });

        symbol(",");
        symbol(")");
        symbol("(end)");

        let interpretToken = (token) => {
            let sym = Object.create(symbols[token.type]);
            sym.type = token.type;
            sym.value = token.value;
            return sym;
        };

        let i = 0;
        let token = () => {
            return interpretToken(tokens[i]);
        };
        let advance = () => {
            i++;
            return token();
        };

        let expression = (rbp) => {
            let left, t = token();
            advance();
            if (!t.nud) throw "Unexpected token: " + t.type;
            left = t.nud(t);
            while (rbp < token().lbp) {
                t = token();
                advance();
                if (!t.led) throw "Unexpected token: " + t.type;
                left = t.led(left);
            }
            return left;
        };

        let infix = (id, lbp, rbp?, led?) => {
            rbp = rbp || lbp;
            symbol(id, null, lbp, led || function (left) {
                return {
                    type: id,
                    left: left,
                    right: expression(rbp)
                };
            });
        };
        let prefix = (id, rbp) => {
            symbol(id, () => {
                return {
                    type: id,
                    right: expression(rbp)
                };
            });
        };

        prefix("-", 7);
        infix("^", 6, 5);
        infix("*", 4);
        infix("/", 4);
        infix("%", 4);
        infix("+", 3);
        infix("-", 3);

        infix("=", 1, 2, (left) => {
            if (left.type === "call") {
                for (let i = 0; i < left.args.length; i++) {
                    if (left.args[i].type !== "identifier") throw "Invalid argument name";
                }
                return {
                    type: "function",
                    name: left.name,
                    args: left.args,
                    value: expression(2)
                };
            } else if (left.type === "identifier") {
                return {
                    type: "assign",
                    name: left.value,
                    value: expression(2)
                };
            } else {
                throw "Invalid lvalue";
            }
        });

        let parseTree = [];
        while (token().type !== "(end)") {
            parseTree.push(expression(0));
        }

        return parseTree;
    }

    /**
     * parses the tree returned from this.parse()
     * @param parseTree
     * @returns {string} the evaluated result
     */
    private evaluate(parseTree) {
        let operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "%": (a, b) => a % b,
            "^": (a, b) => Math.pow(a, b),
        };

        let variables = {
            pi: Math.PI,
            e: Math.E
        };

        let functions = {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.cos,
            asin: Math.asin,
            acos: Math.acos,
            atan: Math.atan,
            abs: Math.abs,
            round: Math.round,
            ceil: Math.ceil,
            floor: Math.floor,
            log: Math.log,
            exp: Math.exp,
            sqrt: Math.sqrt,
            max: Math.max,
            min: Math.min,
            random: Math.random
        };
        let args = {};

        let parseNode = (node) => {
            if (node.type === "number") return node.value;
            else if (operators[node.type]) {
                if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
                return operators[node.type](parseNode(node.right));
            } else if (node.type === "identifier") {
                let value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
                if (typeof value === "undefined") throw node.value + " is undefined";
                return value;
            } else if (node.type === "assign") {
                variables[node.name] = parseNode(node.value);
            } else if (node.type === "call") {
                for (let i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
                return functions[node.name].apply(null, node.args);
            } else if (node.type === "function") {
                functions[node.name] = function(){
                    for (let i = 0; i < node.args.length; i++) {
                        args[node.args[i].value] = arguments[i];
                    }
                    let ret = parseNode(node.value);
                    args = {};
                    return ret;
                };
            }
        };
        let output = "";
        for (let i = 0; i < parseTree.length; i++) {
            let value = parseNode(parseTree[i]);
            if (typeof value !== "undefined") output += value + "\n";
        }
        return output;
    }
}
