import {
    Injectable,
} from '@angular/core';


declare var System: any;
declare var SystemDynamicRouteContainer: any;

/**
 * a service which provides math expression compiler functions
 * author: Sebastian Franz
 */
@Injectable()
export class MathExpressionCompilerService
{
    do(input)
    {
        return MathExpressionCompilerService.evaluate(MathExpressionCompilerService.parse(MathExpressionCompilerService.lex(input)));
    }

    static lex(input:string)
    {
        var isOperator = (c) => { return /[+\-*\/\^%=(),]/.test(c); },
            isDigit = (c) => { return /[0-9]/.test(c); },
            //isVariable = (c) => {   return /[a-z]/.test(c);  },
            isWhiteSpace = (c) => { return /\s/.test(c); },
            isIdentifier = (c) => { return typeof c === "string" && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c); };

        var tokens = [], c, i = 0;
        var advance = () => { return c = input[++i]; };
        var addToken = (type:string, value?) => {
            tokens.push({
                type: type,
                value: value
            });
        };

        while (i < input.length)
        {
            let c = input[i];
            if (isWhiteSpace(c)) advance();
            else if (isOperator(c))
            {
                addToken(c);
                advance();
            }
            else if (isDigit(c))
            {
                let num = '';
                do{
                    num += c;
                    c = advance();
                }
                while(isDigit(c));

                if (c === ".")
                {
                    do{
                        num += c;
                        c = advance();
                    }
                    while(isDigit(c));
                }
                //console.log(num);
                let parsed_num = parseFloat(num);
                if (!isFinite(parsed_num)) throw "Number is too large or too small for a 64-bit double.";
                addToken("number", parsed_num);
            }
            else if (isIdentifier(c))
            {
                let idn = c;
                while (isIdentifier(advance())) idn += c;
                addToken("identifier", idn);
            }
            else throw "Unrecognized token: "+c+" at "+i;
        }
        addToken("(end)");
        return tokens;
    }

    static parse(tokens)
    {

        var symbols = {};
        var symbol = (id, nud?, lbp?, led?) =>
        {
            let sym = symbols[id] || {};
            symbols[id] = {
                lbp: sym.lbp || lbp,
                nud: sym.nud || nud,
                led: sym.led || led
            };
        };

        symbol("(", () =>
        {
            let value = expression(2);
            if (token().type !== ")") throw "Expected closing parenthesis ')'";
            advance();
            return value;
        });
        symbol("number", (number) =>
        {
            return number;
        });
        symbol("identifier", (name) =>
        {
            if (token().type === "(")
            {
                let args = [];
                if (tokens[i + 1].type === ")") advance();
                else
                {
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

        var interpretToken = (token) =>
        {
            let sym = Object.create(symbols[token.type]);
            sym.type = token.type;
            sym.value = token.value;
            return sym;
        };

        var i = 0, token = () => { return interpretToken(tokens[i]); };
        var advance = () => { i++; return token(); };

        var expression = (rbp) =>
        {
            let left, t = token();
            advance();
            if (!t.nud) throw "Unexpected token: " + t.type;
            left = t.nud(t);
            while (rbp < token().lbp)
            {
                t = token();
                advance();
                if (!t.led) throw "Unexpected token: " + t.type;
                left = t.led(left);
            }
            return left;
        };

        var infix = (id, lbp, rbp?, led?) =>
        {
            rbp = rbp || lbp;
            symbol(id, null, lbp, led || function (left) {
                return {
                    type: id,
                    left: left,
                    right: expression(rbp)
                };
            });
        };
        var prefix = (id, rbp) =>
        {
            symbol(id, () =>
            {
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

        infix("=", 1, 2, (left) =>
        {
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
            }
            else throw "Invalid lvalue";
        });

        let parseTree = [];
        //console.log(symbols);
        while (token().type !== "(end)")
        {
            parseTree.push(expression(0));
        }

        return parseTree;
    };

    static evaluate(parseTree)
    {
        var operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "%": (a, b) => a % b,
            "^": (a, b) => Math.pow(a, b),
        };

        var variables = {
            pi: Math.PI,
            e: Math.E
        };

        var functions = {
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
        var args = {};

        let parseNode = (node) =>
        {
            if (node.type === "number") return node.value;
            else if (operators[node.type])
            {
                if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
                return operators[node.type](parseNode(node.right));
            }
            else if (node.type === "identifier")
            {
                let value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
                if (typeof value === "undefined") throw node.value + " is undefined";
                return value;
            }
            else if (node.type === "assign")
            {
                variables[node.name] = parseNode(node.value);
            }
            else if (node.type === "call")
            {
                for (let i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
                return functions[node.name].apply(null, node.args);
            }
            else if (node.type === "function")
            {
                functions[node.name] = function () {
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
        for (let i = 0; i < parseTree.length; i++)
        {
            let value = parseNode(parseTree[i]);
            if (typeof value !== "undefined") output += value + "\n";
        }
        return output;
    };

}