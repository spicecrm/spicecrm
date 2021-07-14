<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

if(!function_exists("randomstring")){ 
    function randomstring(){
        $len = 10;
        $base='abcdefghjkmnpqrstwxyz';
        $max=strlen($base)-1;
        $returnstring = '';
        //2013-09-06 BUG #496 removed ... causing issues in higher php releases
        //mt_srand((double)microtime()*1000000);
        while (strlen($returnstring)<$len+1)
            $returnstring.=$base[mt_rand(0,$max)];

        return $returnstring;

    }
}

function calculate_trendline($values, $offset = true)
{
    // get the total
    $sumX = 0; $sumY = 0;
    foreach($values as $datapointX => $datapointY)    
    {
        $sumY += $datapointY;
        $sumX += $datapointX;
    }

    // get the averages
    $avgX = $sumX / count($values);
    $avgY = $sumY / count($values);

    // get the alpha
    $sumNalpha = 0; $sumZalpha = 0;
    foreach($values as $datapointX => $datapointY)    
    {
        $sumNalpha += ($datapointX - $avgX)*($datapointY - $avgY);
        $sumZalpha += ($datapointX - $avgX) * ($datapointX - $avgX);
    }

    // calculate the alpha value
    $alpha = $sumZalpha > 0 ? $sumNalpha / $sumZalpha : 0;

    $startValue = $avgY - (((count($values) / 2) + 1) * $alpha); 
    $endValue = $avgY + (((count($values) / 2) + 1) * $alpha); 

    return [
    'start' => round($startValue, 0), 
    'end' => round($endValue, 0)
    ];
}
function multisort($array, $sort_by, $key1, $key2=NULL, $key3=NULL, $key4=NULL, $key5=NULL, $key6=NULL){
    // sort by ?
    foreach ($array as $pos =>  $val)
        $tmp_array[$pos] = $val[$sort_by];
    asort($tmp_array);

    // display however you want
    foreach ($tmp_array as $pos =>  $val){
        $return_array[$pos][$sort_by] = $array[$pos][$sort_by];
        $return_array[$pos][$key1] = $array[$pos][$key1];
        if (isset($key2)){
            $return_array[$pos][$key2] = $array[$pos][$key2];
        }
        if (isset($key3)){
            $return_array[$pos][$key3] = $array[$pos][$key3];
        }
        if (isset($key4)){
            $return_array[$pos][$key4] = $array[$pos][$key4];
        }
        if (isset($key5)){
            $return_array[$pos][$key5] = $array[$pos][$key5];
        }
        if (isset($key6)){
            $return_array[$pos][$key6] = $array[$pos][$key6];
        }
    }
    return $return_array;
}

function sortFieldArrayBySequence($first, $second)
{
    return $first['sequence'] - $second['sequence'];
}

function getLastDayOfMonth($month, $year) {
    return date('Y-m-d',strtotime('-1 second',strtotime('+1 month',strtotime($month.'/01/'.$year.' 00:00:00'))));
}


if(file_exists('custom/modules/KReports/utils.php'))
    include('custom/modules/KReports/utils.php');
