#!/usr/bin/env php
<?php
#namespace Pulsestorm\Buildscripts;

function minifyOne($file)
{
    $cmd = "uglifyjs $file";
    $output = `$cmd`;
    return $output;
}

function minifyAll($files)
{
    foreach($files as $key=>$file)
    {
        $files[$key] = minifyOne($key);
    }
    return $files;
}

function jsonAll($files)
{
    foreach($files as $key=>$value)
    {
        $o = new stdClass;
        $o->js = $value;
        $files[$key] = json_encode($o);
    }
    return $files;
}

function createInject($files)
{
    $sExport = array('{');
    foreach($files as $key=>$contents)
    {
        $key = basename($key);
        $key = explode(".",$key);
        $key = array_shift($key);
        if($key == 'config')
        {
            continue;
        }
        $sExport[] = '"' . $key . '"';
        $sExport[] = ':';
        $sExport[] = str_replace('"',"'",$contents);
        $sExport[] = ',';
    }
    array_pop($sExport);
    $sExport[] = '}';
    $sExport = implode('',$sExport);
    $function = "    var js = $sExport;
    return js[key].js;";    
    $inject = file_get_contents('src/inject-preprocessed.js');
    $inject = str_replace('//##INSERT_pulsestormBuildGetContentScript##',$function,$inject);
    return $inject;    
}

function main($argv)
{
    ob_start(); //uglifyjs isn't console clean
    $files = array();
    foreach(glob('src/js/*.js') as $file)
    {        
        $files[$file] = file_get_contents($file);
    }
    $files = minifyAll($files);
    $files = jsonAll($files);
    
    $inject = createInject($files);
    ob_end_clean();
    echo $inject;
}
main($argv);