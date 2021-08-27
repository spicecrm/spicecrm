<?php
namespace SpiceCRM\includes\ErrorHandlers;

class ValidationException extends Exception
{
    protected $isFatal = false;
    protected $httpCode = 422;
    private $validationErrors = [];
    private $name = "";

    public function __construct($message = null, $errorCode = null, $name = null) {
        $this->lbl = 'ERR_HTTP_VALIDATION_ERROR';
        if (!empty($message)) {
            $this->validationErrors = $message;
        }
        if (!empty($name)) {
            $this->name = $name;
        }

        parent::__construct(is_string( $message ) ? $message : 'Validation error', $errorCode);
    }

    /**
     * Getter for the validation errors array.
     *
     * @return array|mixed
     */
    public function getValidationErrors() {
        return $this->validationErrors;
    }

    /**
     * Getter for the parameter name.
     *
     * @return string
     */
    public function getParamName(): string {
        return $this->name;
    }
}