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



    // assign a class to each step that defines the desired background for that step.
    // This replicates the last defined background info for each step until there is a step that already defines it. Then this info will be replicated further down the line...
    var rootId = rootId || "impress";
    var root = util.byId( rootId );
    var steps = util.$$( ".step", root );
    var current_bg_img_class = ""

    steps.forEach(function(step) {

        var number_of_classes = step.classList.length;
        var step_already_has_background_class = false;

        for (var i = 0; i < number_of_classes; i++) {
            var class_name = step.classList.item(i);

            if (class_name.includes("bg_img_")){
                step_already_has_background_class = true;
                current_bg_img_class = class_name;
            }
          }

        if (! step_already_has_background_class){
            if (current_bg_img_class != ""){
                step.classList.add( current_bg_img_class );
            }  
        }
     });

    


    // apply "coming" and "over" class on stepleave + fade background if desired by applying a respective class to the body
    document.getElementById("impress").addEventListener( "impress:stepleave", function (event) {
        
        console.log("leave event triggered!");

        var rootId = rootId || "impress";
        var root = util.byId( rootId );
        var steps = util.$$( ".step", root );

        var current_step = event.target;

        var current_step_number = parseInt(current_step.attributes["step"].value);
        var goto_step_number = parseInt(event.detail.next.attributes["step"].value);


        steps.forEach(function(step) {

           var loop_step_number = parseInt(step.attributes["step"].value);

             if (loop_step_number < goto_step_number){
                 step.classList.add( "over" );
                 step.classList.remove( "coming" );
             }
             else if (loop_step_number > goto_step_number){
                step.classList.add( "coming" );
                step.classList.remove( "over" );
            }

            // step is the goto step
            else {
                step.classList.remove( "coming" );
                step.classList.remove( "over" );

                
                // We check this step for it's background information. Because we want to fade the background to the step we are appraching.
                // If it has some background information we will take that class name which starts with "bg_img_" and add a class to the body that starts with "bg__" and goes on like the one on the step.
                // So "bg_img_5" class on a step will translate to "bg__5" class on the body object. While deleting all other "bg__" classes
                // This means that we can now apply classes like "bg_img_something" to a step without defining that class in css. So it will do nothing. Instead we define "bg__something" which defines the background image of the body. And voila, we have a fading background image.

                var number_of_classes = step.classList.length;
                var step_includes_bg_information = false;

                for (var i = 0; i < number_of_classes; i++) {
                    var class_name = step.classList.item(i);
                    
                    if (class_name.includes("bg_img_")){
                        
                        step_includes_bg_information = true;

                        var translated_class_name =class_name.replace("img", "");
                        
                        

                        var body = document.getElementsByTagName("BODY")[0];

                        var num_of_body_classes = body.classList.length;

                        for (var j = 0; j < num_of_body_classes; j++) {
                            
                            var body_class_name = body.classList.item(j);
                            
                            if (body_class_name != null && body_class_name.includes("bg__")){
                                
                                if (body_class_name != translated_class_name){
                                    body.classList.remove(body_class_name)
                                } 
                            }
                        }

                        body.classList.add(translated_class_name);
                    }
                }
                    
                // the step has no class that represents a background (starts with "bg_img_")
                if (!step_includes_bg_information){
                    console.log("my current class does not have background information");
                    var body = document.getElementsByTagName("BODY")[0];

                    var num_of_body_classes = body.classList.length;

                    for (var j = 0; j < num_of_body_classes; j++) {
                        
                        var body_class_name = body.classList.item(j);
                        if (body_class_name != null && body_class_name.includes("bg__")){
                                body.classList.remove(body_class_name)  
                        }
                    }
                }
                    
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