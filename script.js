

function validateAndGetFormData() { 
    var rollNoVar = $("#rollNo").val(); 
    if (rollNoVar === "") { 
        alert("Roll Number is a Required Value"); 
        $("#rollNo").focus(); 
        return ""; 
    }

    var fullNameVar = $("#fullName").val(); 
    if (fullNameVar === "") { 
        alert("Full Name is a Required Value"); 
        $("#fullName").focus(); 
        return ""; 
    }

    var classVar = $("#class").val(); 
    if (classVar === "") { 
        alert("Class is a Required Value"); 
        $("#class").focus(); 
        return ""; 
    }

    var birthdateVar = $("#birthdate").val(); 
    if (birthdateVar === "") { 
        alert("Birthdate is a Required Value"); 
        $("#birthdate").focus(); 
        return ""; 
    }

    var addressVar = $("#address").val(); 
    if (addressVar === "") { 
        alert("Address is a Required Value"); 
        $("#address").focus(); 
        return ""; 
    }

    var enrollmentDateVar = $("#enrollmentDate").val(); 
    if (enrollmentDateVar === "") { 
        alert("Enrollment Date is a Required Value"); 
        $("#enrollmentDate").focus(); 
        return ""; 
    }

    var jsonStrObj = { 
        rollNo: rollNoVar, 
        fullName: fullNameVar, 
        class: classVar, 
        birthdate: birthdateVar, 
        address: addressVar, 
        enrollmentDate: enrollmentDateVar, 
    }; 

    return JSON.stringify(jsonStrObj); 
} 

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}
function getrollNoAsJsonObj(){
    var rollNo =$('#rollNo').val();
    var jsonStr={
        rollNo:rollNo
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data=JSON.parse(jsonObj.data).record;
    
    $("#fullName").val(data.fullName); 
    $("#class").val(data.class); 
    $("#birthdate").val(data.birthdate); 
    $("#address").val(data.address); 
    $("#enrollmentDate").val(data.enrollmentDate); 


}
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) { 
    var url = dbBaseUrl + apiEndPointUrl; 
    var jsonObj; 
    $.post(url, reqString, function (result) { 
        jsonObj = JSON.parse(result); 
    }).fail(function (result) { 
        var dataJsonObj = result.responseText; 
        jsonObj = JSON.parse(dataJsonObj); 
    }); 
    return jsonObj; 
} 

function getEnrollment(){
    var rollNoObj=getrollNoAsJsonObj();
    var getRequest=createGET_BY_KEYRequest("90932096|-31949221610828263|90962070", "SCHOOL-DB", "STUDENT-TABLE",rollNoObj);
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(getRequest, "http://api.login2explore.com:5577", "/api/irl"); 
    jQuery.ajaxSetup({async: true}); 
    if(resultObj.status === 400){
        $("#enrollmentSave").prop('disabled',false); 
        $("#enrollmentReset").prop('disabled',false); 
        $("#fullName").focus(); 
    }else if (resultObj.status === 200){

        $("#rollNo").prop('disabled',true); 
        fillData(resultObj);
        $("#enrollmentUpdate").prop('disabled',false); 
        $("#enrollmentReset").prop('disabled',false); 
        $("#fullName").focus(); 
    }
}

// This method is used to create PUT Json request. 
function createPUTRequest(connToken, jsonObj, dbName, relName) { 
    var putRequest = "{\n" 
        + "\"token\" : \"" 
        + connToken 
        + "\",\n" 
        + "\"dbName\": \"" 
        + dbName 
        + "\",\n" 
        + "\"cmd\" : \"PUT\",\n" 
        + "\"rel\" : \"" 
        + relName + "\",\n" 
        + "\"jsonStr\": \n" 
        + jsonObj 
        + "\n" 
        + "}"; 
    return putRequest; 
} 


function resetForm() { 
    $("#rollNo").val(""); 
    $("#fullName").val(""); 
    $("#class").val(""); 
    $("#birthdate").val(""); 
    $("#address").val(""); 
    $("#enrollmentDate").val(""); 
    $("#rollNo").prop("disabled",false); 
    $("#enrollmentSave").prop("disabled",true); 
    $("#enrollmentUpdate").prop("disabled",true); 
    $("#enrollmentReset").prop("disabled",true); 

    $("#rollNo").focus(); 
} 

function saveEnrollment() { 
    var jsonStr = validateAndGetFormData(); 
    if (jsonStr === "") { 
        return; 
    } 
    var putReqStr = createPUTRequest("90932096|-31949221610828263|90962070", jsonStr, "SCHOOL-DB", "STUDENT-TABLE"); 
    
    jQuery.ajaxSetup({async: false}); 
    var resultObj = executeCommand(putReqStr, "http://api.login2explore.com:5577", "/api/iml"); 
    console.log(resultObj)
    jQuery.ajaxSetup({async: true}); 
    resetForm(); 
    $("#rollNo").focus(); 

} 
function updateEnrollment(){
    $('#enrollmentUpdate').prop('disabled',true);
    jsonChg=validateAndGetFormData();
    var updateRequest =createUPDATERecordRequest("90932096|-31949221610828263|90962070",jsonChg,"SCHOOL-DB","STUDENT-TABLE",localStorage.getItem('recno'))
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(updateRequest, "http://api.login2explore.com:5577", "/api/iml"); 
    console.log(resultObj)
    jQuery.ajaxSetup({async: true}); 
    resetForm(); 
    $("#rollNo").focus(); 
}
