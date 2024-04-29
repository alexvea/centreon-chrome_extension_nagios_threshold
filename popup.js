
document.getElementById("test_button").addEventListener("click", test_thresholds);
document.getElementById("explain").addEventListener("click", test_thresholds);
document.getElementById("random").addEventListener("click", random_value);

function random_value() {
    let min = (document.getElementById("warning").value) ? document.getElementById("warning").value.replace("@", "").replace("~:", ""): document.getElementById("warning").placeholder;
    let max = (document.getElementById("critical").value) ? document.getElementById("critical").value.replace("@", "").replace("~:", ""): document.getElementById("critical").placeholder
    document.getElementById("value").value = randomNumberFromInterval(min, max);
    test_thresholds();
}

Number.prototype.countDecimals = function () {

    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

    var str = this.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
}


function randomNumberFromInterval(min, max) { // min and max included
    if (parseFloat(min) % 1 != 0 || parseFloat(max) % 1 != 0) {
        var precision = ( parseFloat(min).countDecimals() != 0) ? parseFloat(min).countDecimals():parseFloat(max).countDecimals() ; 
        var generatedNumber = Math.floor(Math.random() * (parseFloat(max) + parseFloat(min))) + Math.floor(Math.random() * (parseFloat(max) * precision - parseFloat(min) * precision) + parseFloat(min)) / (parseFloat(min));
        generatedNumber = generatedNumber.toFixed(precision);
    } else {
        var generatedNumber = Math.floor(Math.random() * (parseFloat(max) + parseFloat(min)));
    }
    return generatedNumber;
}


function determine_final_status(warning_status,critical_status) {
    let final_status="UNKNOWN";
    switch (true) {
        case (critical_status == "yes" && warning_status == "yes"):
            final_status="CRITICAL";
            explanation_threshold_content +="Both thresholds have been triggered, CRITICAL is more important."
        break;
        case critical_status == "yes":
            final_status="CRITICAL";
            explanation_threshold_content +="CRITICAL is the current status."
        break;
        case warning_status == "yes":
            final_status="WARNING";
            explanation_threshold_content +="WARNING is the current status."
        break;

        default:
            final_status="OK";
            explanation_threshold_content +="OK is the current status."
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
        case /^(-|)\d*\.?\d*$/.test(threshold_value):
        //Range definition: 10 // Generate an alert if x... : < 0 or > 10, (outside the range of {0 .. 10})
            threshold_reached = (parseFloat(value) < 0 || parseFloat(value) > parseFloat(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < 0 or > "+threshold_value+", (outside the range of {0 .. "+threshold_value+"}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^(-|)\d*\.?\d*:$/.test(threshold_value):
        //Range definition: 10: // Generate an alert if x... : < 10, (outside {10 .. ∞})
            threshold_value = threshold_value.substring(0, threshold_value.length - 1);
            threshold_reached = (parseFloat(value) < parseFloat(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < "+threshold_value+", (outside {"+threshold_value+" .. &infin;}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^~:(-|)\d*\.?\d*$/.test(threshold_value):
        //Range definition: ~:10 // Generate an alert if x... : > 10, (outside the range of {-∞ .. 10})
            threshold_value = threshold_value.substring(2);
            threshold_reached = (parseFloat(value) > parseFloat(threshold_value)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is > "+threshold_value+", (outside the range of {-&infin; .. "+threshold_value+"}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^(-|)\d*\.?\d*:(-|)\d*\.?\d*$/.test(threshold_value):
        //Range definition: 10:20 // Generate an alert if x... : < 10 or > 20, (outside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0];
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseFloat(threshold_value_left),parseFloat(threshold_value_right)));
            threshold_reached = (parseFloat(value) <  parseFloat(threshold_value_left) || parseFloat(value) > parseFloat(threshold_value_right)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is < "+threshold_value_left+" or > "+threshold_value_right+", (outside the range of {"+threshold_value_left+" .. "+threshold_value_right+"}. Triggered : "+threshold_reached+"<br>";
        break;
        case /^@(-|)\d*\.?\d*:(-|)\d*\.?\d*$/.test(threshold_value):
        //Range definition: @10:20 // Generate an alert if x... : <= 10 and >= 20, (inside the range of {10 .. 20})
            array_threshold_value = threshold_value.split(":");
            threshold_value_left = array_threshold_value[0].substring(1);
            threshold_value_right = array_threshold_value[1];
            //TODO skip if rule first rule not respected
            console.log(check_first_rule(parseFloat(threshold_value_left),parseFloat(threshold_value_right)));
            threshold_reached = (parseFloat(value) >=  parseFloat(threshold_value_left) && parseFloat(value) <= parseFloat(threshold_value_right)) ? "yes":"no";
            explanation_threshold_content += "Range definition: "+threshold_value+" for "+status+ " threshold. Generate an alert if current value "+value+" is &#8805; "+threshold_value_left+" and &#8804; "+threshold_value_right+", (inside the range of {"+threshold_value_left+" .. "+threshold_value_right+"}. Triggered : "+threshold_reached+"<br>";
        break;
        default:
            threshold_reached="no";
        break;
    }
    return threshold_reached;
}
