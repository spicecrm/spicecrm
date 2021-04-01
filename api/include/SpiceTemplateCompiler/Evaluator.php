<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
// https://github.com/djfm/Evaluator
namespace SpiceCRM\includes\SpiceTemplateCompiler;

class Evaluator
{

    //operators by order of precedence and with their arity
    private $operators = [
        '!' => 1,
        '/' => 2,
        '*' => 2,
        '-' => 2,
        '+' => 2,
        '<' => 2,
        '>' => 2,
        '<=' => 2,
        '>=' => 2,
        '&&' => 2,
        '||' => 2,
        '!=' => 2,
        '==' => 2
    ];

    public function __construct($expression)
    {
        $number = '/\b\d+(?:\.\d+)?\b/';
        $variable = '/\$\w+/';
        $operator = '/[\!&\|+\-<>=\\/\*]+/';

        $numbers = [];
        preg_match_all($number, $expression, $numbers);
        $numbers = $numbers[0];

        $variables = [];
        preg_match_all($variable, $expression, $variables);
        $variables = $variables[0];

        $operators = [];
        preg_match_all($operator, $expression, $operators);
        $operators = $operators[0];

        $expression = preg_replace($variable, "v", $expression);
        $expression = preg_replace($number, "n", $expression);
        $expression = preg_replace($operator, "o", $expression);

        $nodes = [];
        $group = &$nodes;
        $stack = [];
        for ($i = 0; $i < strlen($expression); $i += 1) {
            if ($expression[$i] == 'v') {
                $group[] = ['type' => 'variable', 'value' => array_shift($variables)];
            } else if ($expression[$i] == 'n') {
                $group[] = ['type' => 'number', 'value' => (float)array_shift($numbers)];
            } else if ($expression[$i] == 'o') {
                $group[] = ['type' => 'operator', 'value' => array_shift($operators)];
            } else if ($expression[$i] == '(') {
                if (isset($elements)) unset($elements);
                $elements = [];
                $subgroup = ['type' => 'group', 'nodes' => &$elements];
                $group[] = $subgroup;
                $stack[] = &$group;
                unset($group);
                $group = &$elements;
            } else if ($expression[$i] == ')') {
                $top = &$stack[count($stack) - 1];
                array_pop($stack);
                $group = &$top;
            }
        }

        $nodes = ['type' => 'group', 'nodes' => $nodes];

        $this->canonicalize($nodes);
        $this->apply_precedence($nodes);
        $this->canonicalize($nodes);

        $this->ast = $nodes;
    }

    public function getParsedExpression()
    {
        return $this->toString($this->ast);
    }

    public function evaluate($arguments = [])
    {
        return $this->reduce($this->ast, $arguments);
    }

    private function compute($operator, $arguments)
    {
        if ($operator == '!') return (int)(!$arguments[0]);
        else if ($operator == '/') return $arguments[0] / $arguments[1];
        else if ($operator == '*') return $arguments[0] * $arguments[1];
        else if ($operator == '-') return $arguments[0] - $arguments[1];
        else if ($operator == '+') return $arguments[0] + $arguments[1];
        else if ($operator == '&&') return (int)($arguments[0] && $arguments[1]);
        else if ($operator == '||') return (int)($arguments[0] || $arguments[1]);
        else if ($operator == '<') return (int)($arguments[0] < $arguments[1]);
        else if ($operator == '>') return (int)($arguments[0] > $arguments[1]);
        else if ($operator == '<=') return (int)($arguments[0] <= $arguments[1]);
        else if ($operator == '>=') return (int)($arguments[0] >= $arguments[1]);
        else if ($operator == '!=') return (int)($arguments[0] != $arguments[1]);
        else if ($operator == '==') return (int)($arguments[0] == $arguments[1]);
        else throw new \Exception("Unknown operator $operator!");
    }

    private function reduce($node, $arguments)
    {
        if ($node['type'] == 'application') {
            $ops = [];
            foreach ($node['operands'] as $operand) {
                $ops[] = $this->reduce($operand, $arguments);
            }
            return $this->compute($node['operator'], $ops);
        } else if ($node['type'] == 'number') return $node['value'];
        else if ($node['type'] == 'variable') {
            if (isset($arguments[$node['value']])) {
                return $arguments[$node['value']];
            } else throw new \Exception("Variable " . $node['value'] . " was not assigned!");
        } else throw new \Exception("Don't know how to reduce node with type " . $node['type']);
    }

    private function toString($node)
    {
        if ($node['type'] == 'group') {
            return '[ ' . implode(' ', array_map([$this, 'toString'], $node['nodes'])) . ' ]';
        } else if ($node['type'] == 'application') {
            if ($this->operators[$node['operator']] == 1) {
                return '( ' . $node['operator'] . $this->toString($node['operands'][0]) . ' )';
            } else {
                return '( ' . $this->toString($node['operands'][0]) . ' ' . $node['operator'] . ' ' . $this->toString($node['operands'][1]) . ' )';
            }
        } else {
            return $node['value'];
        }
    }

    //remove superfluous parentheses
    private function canonicalize(&$node)
    {
        if ($node['type'] == 'group') {
            foreach ($node['nodes'] as &$child) {
                $this->canonicalize($child);
            }
            if (count($node['nodes']) == 1) {
                $node = $node['nodes'][0];
            }
        } else if ($node['type'] == 'application') {
            foreach ($node['operands'] as &$child) {
                $this->canonicalize($child);
            }
        }
    }

    private function apply_precedence(&$node)
    {
        if ($node['type'] == 'group') {
            foreach ($node['nodes'] as &$child) {
                $this->apply_precedence($child);
            }
            foreach ($this->operators as $operator => $arity) {
                do {
                    $index = -1;
                    for ($i = 0; $i < count($node['nodes']); $i += 1) {
                        if (($node['nodes'][$i]['type'] == 'operator') and ($node['nodes'][$i]['value'] == $operator)) {
                            $index = $i;
                            break;
                        }
                    }
                    if ($index >= 0) {
                        $new_nodes = ($arity == 1) ? array_slice($node['nodes'], 0, $index) : array_slice($node['nodes'], 0, $index - 1);
                        $operands = ($arity == 1) ? [$node['nodes'][$index + 1]] : [$node['nodes'][$index - 1], $node['nodes'][$index + 1]];
                        $application = ['type' => 'application', 'operator' => $operator, 'operands' => $operands];
                        $new_nodes[] = $application;
                        $new_nodes = array_merge($new_nodes, array_slice($node['nodes'], $index + 2));
                        $node['nodes'] = $new_nodes;
                    }
                } while ($index >= 0);
            }
        }
    }

}
