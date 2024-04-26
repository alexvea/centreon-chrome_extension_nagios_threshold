
document.getElementById("test_button").addEventListener("click", test_thresholds);

function determine_final_status(warning_status,critical_status) {
    let final_status="UNKNOWN";
    switch (true) {
        case critical_status == "critical":
        final_status=critical_status.toUpperCase();
        break;
        case warning_status == "warning":
            final_status=warning_status.toUpperCase();
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

    //check both thresholds
    warning_status=check_threshold(value,warning_value,"warning");
    critical_status=check_threshold(value,critical_value,"critical");
    
    //put value to form
    document.getElementById("result_perfdata").innerHTML = "'label'="+value+";"+warning_value+";"+critical_value+";[min];[max]";
    document.getElementById("result_status").value = determine_final_status(warning_status,critical_status);
}

function check_first_rule(threshold_start,threshold_end) {
    // start ≤ end
    return (threshold_start <= threshold_end) ? true:false;
}

function check_threshold(value,threshold_value,status) {
    console.log(typeof(value));
    console.log(typeof(threshold_value));
    switch (true) {
        case /^\d*\d$/.test(threshold_value):
        //Range definition: 10 // Generate an alert if x... : < 0 or > 10, (outside the range of {0 .. 10})
            threshold_reached = (parseInt(value) < 0 || parseInt(value) > parseInt(threshold_value)) ? status:"no_"+status;
        break;
        case /^\d*:$/.test(threshold_value):
        //Range definition: 10: // Generate an alert if x... : < 10, (outside {10 .. ∞})
            threshold_value = threshold_value.substring(0, threshold_value.length - 1);
            threshold_reached = (parseInt(value) < parseInt(threshold_value)) ? status:"no_"+status;
        break;
        case /^~:\d*\d$/.test(threshold_value):
        //Range definition: ~:10 // Generate an alert if x... : > 10, (outside the range of {-∞ .. 10})
            threshold_value = threshold_value.substring(2);
            threshold_reached = (parseInt(value) > parseInt(threshold_value)) ? status:"no_"+status;
        break;
        case /^\d*:\d*$/.test(threshold_value):
        //Range definition: 10:20 // Generate an alert if x... : < 10 or > 20, (outside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0];
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseInt(threshold_value_left),parseInt(threshold_value_right)));
            threshold_reached = (parseInt(value) <  parseInt(threshold_value_left) || parseInt(value) > parseInt(threshold_value_right)) ? status:"no_"+status;
        break;
        case /^@\d*:\d*$/.test(threshold_value):
        //Range definition: @10:20 // Generate an alert if x... : ≥ 10 and ≤ 20, (inside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0].substring(1);
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseInt(threshold_value_left),parseInt(threshold_value_right)));
            threshold_reached = (parseInt(value) >=  parseInt(threshold_value_left) && parseInt(value) <= parseInt(threshold_value_right)) ? status:"no_"+status;
        break;
        default:
            threshold_reached="no_"+status;
        break;
    }
    return threshold_reached;
}
