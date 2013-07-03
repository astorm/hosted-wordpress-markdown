#!/usr/bin/env php
<?php
// The MIT License (MIT)
// 
// Copyright (c) 2013 Pulse Storm LLC. 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
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