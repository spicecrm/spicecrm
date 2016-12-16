<?php

class SyncContactItem {

    protected $vardefs;

    public function __construct($vardefs) {
        $this->vardefs = $vardefs;
    }

    public function getVardefs() {
        return $this->vardefs;
    }

    public function __set($name, $value) {
        if (!array_key_exists($name, $this->vardefs)) {
            throw new Exception("field not defined");
        }
        $this->{$name} = $value;
    }

    public function __get($name) {
        if (!array_key_exists($name, $this->vardefs)) {
            throw new Exception("field not defined");
        }
        return NULL;
    }

}
