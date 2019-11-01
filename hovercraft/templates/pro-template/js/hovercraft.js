// Main hovercraft js file
( function( document ) {
    "use strict";


    // these two variables will be filled through the EventListener listening to the "impress:init" event.
    // with util we now can use all the functions like in impress itself where it says: lib.util... 
    var api;
    var util;


    document.addEventListener( "impress:init", function( event ) {
        
        // these are available in the "impress:init" event. But not in for example the "impress:stepenter" event. So we have to get them here.
        api = event.detail.api;
        util = api.lib.util;


        // Set up the help-box
        // Overwrite the default navigation help
        util.triggerEvent( document, "impress:help:add", { command: "Left, Down, Page Down, Space",
                                                           text: "Next step",
                                                           row: 1 } );
        util.triggerEvent( document, "impress:help:add", { command: "Right, Up, Page Up",
                                                           text: "Previous step",
                                                           row: 2 } );
                                                
        
    });

    // Initialize impress.js
    impress().init();

    var impressattrs = document.getElementById('impress').attributes;
    if (impressattrs.hasOwnProperty('auto-console') && impressattrs['auto-console'].value.toLowerCase() === 'true') {
        impressConsole().open();
    }


    // apply "coming" and "over" class on stepleave
    document.getElementById("impress").addEventListener( "impress:stepleave", function (event) {
        
        console.log("leave event triggered!");

        var rootId = rootId || "impress";
        var root = util.byId( rootId );
        var steps = util.$$( ".step", root );

        var current_step = event.target;

        var current_step_number = parseInt(current_step.attributes["step"].value);
        var goto_step_number = parseInt(event.detail.next.attributes["step"].value);
        
        console.log(current_step_number);
        console.log(goto_step_number);



        steps.forEach(function(step) {

           var loop_step_number = parseInt(step.attributes["step"].value);

             if (loop_step_number <= goto_step_number){
                 step.classList.add( "over" );
                 step.classList.remove( "coming" );
             }
             else if (loop_step_number >= goto_step_number){
                step.classList.add( "coming" );
                step.classList.remove( "over" );
            }
            else {
                step.classList.remove( "coming" );
                step.classList.remove( "over" );
            }
        });
        
    
    }, false);


    // remove "coming" and "over" class on stepenter
    document.getElementById("impress").addEventListener( "impress:stepenter", function (event) { 

        var current_step = event.target;

        current_step.classList.remove( "coming" );
        current_step.classList.remove( "over" );

    }, false);


}) (document);


// Function updating the slide number counter
function update_slide_number(evt)
{
    var step = evt.target.attributes['step'].value;
    document.getElementById('slide-number').innerText = parseInt(step) + 1;
}