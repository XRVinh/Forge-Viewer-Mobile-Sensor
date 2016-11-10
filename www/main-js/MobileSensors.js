// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Xiaodong Liang 2016 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
////////////////////////////////////////////////////////////////////////////////-->

var socket = null;
 var lastr = 0;
var lastg = 0;
var lastb = 0;

$(document).ready(function () {

    $('#EmmitGyroData').click(function (evt) {

        if($(this)[0].checked)
        {
            //Monitor Device Orientation
            if(window.DeviceOrientationEvent){
                window.addEventListener("deviceorientation", orientation, false);
                socket = io('<your website>');

            }else{
                alert("DeviceOrientationEvent is not supported");
            }
        }
        else {
            //undelegate Device Orientation
            window.removeEventListener("deviceorientation",orientation);
            socket.disconnect();
            socket = null;
            $('#gyrobig').text('Check [Emmit Gyro Data] to Start');
        }
    });
});



function orientation(event){

    //just for demo.rephrase the data
    var r = parseInt(event.alpha)/10.0 ;
    var g =  parseInt(event.beta) ;
    var b =  parseInt(event.gamma) ;

    var thistext = r + ', '
        + g + ', '
        + b;
    $('#gyrobig').text(thistext);


    //avoid frequent emmit
    if(Math.abs(r-lastr ) > 5 || Math.abs(g-lastg ) > 5 || Math.abs(b-lastb ) > 5)
    {
        //element ID has not been used by this demo yet. reserve for future
        var IoTJson = {elementID:'183911',GyroData:{alpha:r,beta:g,gamma:b}};
        socket.emit('au_Gyro',JSON.stringify(IoTJson));

        lastr = r;
        lastg = g;
        lastb = b;
    }
}
