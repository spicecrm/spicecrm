<?php
require_once 'SpiceSwaggerParser.php';

use SpiceCRM\includes\SpiceSwagger\SpiceSwaggerParser;

$yamlContent = file_get_contents('./VipmobileCustomerDetails-1.1-SNAPSHOT.yml');
$response = SpiceSwaggerParser::execute($yamlContent, 'getSubscriberType', ['msisdn' => '3815478966666']);

echo "<pre>";
print_r($response);
echo "</pre>";
