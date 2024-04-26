
document.getElementById("test_button").addEventListener("click", test_thresholds);

function determine_final_status(warning_status,critical_status) {
    let final_status="UNKNOWN";
    switch (true) {
        case (critical_status == "yes" && warning_status == "yes"):
            final_status="CRITICAL";
            explanation_threshold_content +="Both thresholds have been triggered, CRITICAL is more important."
        break;
        case critical_status == "yes":
            final_status="CRITICAL";
        break;
        case warning_status == "yes":
            final_status="WARNING";
        break;

        default:
            final_status="OK";
        break;
    }
    return final_status;
}

function test_thresholds() {
    //get value from form
    warning_value = document.getElementById("warning").value;
    critical_value = document.getElementById("critical").value;
    value = document.getElementById("value").value;
    explanation = document.getElementById("explain").checked;
    explanation_content ="";
    explanation_threshold_content = "";
    //check both thresholds
    warning_status=check_threshold(value,warning_value,"warning");
    critical_status=check_threshold(value,critical_value,"critical");
    
    //put value to form
    document.getElementById("result_status").value = determine_final_status(warning_status,critical_status);
    if (explanation === false) {
        explanation_content = "";
        explanation_threshold_content = "";
        document.getElementById("result_perfdata").innerHTML = "'label'="+value+";"+warning_value+";"+critical_value+";[min];[max]";
        
    } else {
        document.getElementById("result_perfdata").innerHTML = "<span style=\"color:green\">'label'</span>=<span style=\"color:blue\">"+value+"</span>;<span style=\"color:orange\">"+warning_value+"</span>;<span style=\"color:red\">"+critical_value+"</span>;<span style=\"color:gray\">[min]</span>;<span style=\"color:pink\">[max]</span> <br />"+explanation_content;
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:green\">'green'</span> : the name of metric."
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:blue\">'blue'</span> : the current value."
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:orange\">'orange'</span> : the warning threshold."
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:red\">'red'</span> : the critical threshold."
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:gray\">'gray'</span> : the minimum metric value."
        document.getElementById("result_perfdata").innerHTML += "<br>In <span style=\"color:pink\">'pink'</span> : the maximum metric value."
        document.getElementById("result_perfdata").innerHTML += "<br><br>"+explanation_threshold_content

    }    

    

}

function check_first_rule(threshold_start,threshold_end) {
    // start ≤ end
    return (threshold_start <= threshold_end) ? true:false;
}

function check_threshold(value,threshold_value,status) {
    switch (true) {
        case /^\d*\d$/.test(threshold_value):
        //Range definition: 10 // Generate an alert if x... : < 0 or > 10, (outside the range of {0 .. 10})
            threshold_reached = (parseInt(value) < 0 || parseInt(value) > parseInt(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < 0 or > 10, (outside the range of {0 .. 10}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^\d*:$/.test(threshold_value):
        //Range definition: 10: // Generate an alert if x... : < 10, (outside {10 .. ∞})
            threshold_value = threshold_value.substring(0, threshold_value.length - 1);
            threshold_reached = (parseInt(value) < parseInt(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < 10, (outside {10 .. &infin;}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^~:\d*\d$/.test(threshold_value):
        //Range definition: ~:10 // Generate an alert if x... : > 10, (outside the range of {-∞ .. 10})
            threshold_value = threshold_value.substring(2);
            threshold_reached = (parseInt(value) > parseInt(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is > 10, (outside the range of {-&infin; .. 10}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^\d*:\d*$/.test(threshold_value):
        //Range definition: 10:20 // Generate an alert if x... : < 10 or > 20, (outside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0];
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseInt(threshold_value_left),parseInt(threshold_value_right)));
            threshold_reached = (parseInt(value) <  parseInt(threshold_value_left) || parseInt(value) > parseInt(threshold_value_right)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < 10 or > 20, (outside the range of {10 .. 20}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^@\d*:\d*$/.test(threshold_value):
        //Range definition: @10:20 // Generate an alert if x... : <= 10 and >= 20, (inside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0].substring(1);
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseInt(threshold_value_left),parseInt(threshold_value_right)));
            threshold_reached = (parseInt(value) >=  parseInt(threshold_value_left) && parseInt(value) <= parseInt(threshold_value_right)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is &#8805; 10 and &#8804; 20, (inside the range of {10 .. 20}. Triggered : "+threshold_reached+"<br>";
        break;
        default:
            threshold_reached="no_"+status;
        break;
    }
    return threshold_reached;
}
