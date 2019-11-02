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


    // This happens after initialization. We now apply some classes for each step and update the background class for the body, so it also works on the first load, not just when we made the first transition.
    var rootId = rootId || "impress";
    var root = util.byId( rootId );
    var steps = util.$$( ".step", root );
    var current_step_number = get_current_step();
    var current_bg_img_class = ""
    
    console.log(current_step_number);

    steps.forEach(function(step) {

        var number_of_classes = step.classList.length;
        var step_already_has_background_class = false;

        // replicate background class from step before if this step has no class defining the background.
        for (var i = 0; i < number_of_classes; i++) {
            var class_name = step.classList.item(i);

            if (class_name.includes("body--")){
                step_already_has_background_class = true;
                current_bg_img_class = class_name;
            }
          }

        if (! step_already_has_background_class){
            if (current_bg_img_class != ""){
                step.classList.add( current_bg_img_class );
            }  
        }


        // apply "over" and "coming" classes
        var loop_step_number = parseInt(step.attributes["step"].value);

        if (loop_step_number + 1 < current_step_number){
            step.classList.add( "over" );
            step.classList.remove( "coming" );
        }
        else if (loop_step_number + 1 > current_step_number){
            step.classList.add( "coming" );
            step.classList.remove( "over" );
        }

        else {
            step.classList.remove( "coming" );
            step.classList.remove( "over" );

            update_body_classList_with_background_info(step);
        }


     });

    


    // apply "coming" and "over" class on stepleave + apply specific class to body if defined in step
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

                update_body_classList_with_background_info(step);
                   
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





// This function will apply a specific class to he body tag if the step defines one.
// The "body--" class on a step will translate to "body__" class on the body object. While deleting all other "body__" classes. So there is always only one "body__" class on body.
// This means that we can now apply classes like "body--something" to a step without defining that class in css. So it will do nothing. 
// Instead we define "body__something" which for example defines the background image of the body. And voila, we have a fading background image!
function update_body_classList_with_background_info(step)
{
    var number_of_classes = step.classList.length;
    var step_includes_bg_information = false;

    for (var i = 0; i < number_of_classes; i++) {
        var class_name = step.classList.item(i);
        
        // step has a class that defines a specific body class (starts with "body--")
        if (class_name.includes("body--")){
            
            step_includes_bg_information = true;

            var translated_class_name =class_name.replace("--", "__");
            
            

            var body = document.getElementsByTagName("BODY")[0];

            var num_of_body_classes = body.classList.length;

            for (var j = 0; j < num_of_body_classes; j++) {
                
                var body_class_name = body.classList.item(j);
                
                if (body_class_name != null && body_class_name.includes("body__")){
                    
                    if (body_class_name != translated_class_name){
                        body.classList.remove(body_class_name)
                    } 
                }
            }

            body.classList.add(translated_class_name);
        }
    }
        
    // step has no class that defines a specific body class (none starts with "body--")
    if (!step_includes_bg_information){

        var body = document.getElementsByTagName("BODY")[0];

        var num_of_body_classes = body.classList.length;

        for (var j = 0; j < num_of_body_classes; j++) {
            
            var body_class_name = body.classList.item(j);
            if (body_class_name != null && body_class_name.includes("body__")){
                    body.classList.remove(body_class_name)  
            }
        }
    }
        
}




// This function will return the current step as integer
function get_current_step()
{
    var body = document.getElementsByTagName("BODY")[0];

    var num_of_body_classes = body.classList.length;

    for (var j = 0; j < num_of_body_classes; j++) {
        
        var body_class_name = body.classList.item(j);
        
        if (body_class_name.includes("impress-on-step-")){
            
            if (body_class_name != null && body_class_name.includes("impress-on-step-")){
                return  parseInt( body_class_name.replace("impress-on-step-", "") );
            } 
        }
    }   
}