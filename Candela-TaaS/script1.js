function modify(checkbox) {
    const test_data = {
        "S.No.": checkbox.value.split("_")[0],
        "Test Suite/Test Case": checkbox.value.split("_")[1],
        "Estimated Time (in Days)": checkbox.value.split("_")[2]
      }
      if(checkbox.value.split("_")[0].split(".")[2]==0 ){
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const mainCheckbox = document.getElementById(checkbox.value.split("_")[0])
            checkboxes.forEach(checkbox_sub => {
                if ((checkbox_sub.value.split("_")[0].split(".")[0]+'.'+checkbox_sub.value.split("_")[0].split(".")[1]+'.') == checkbox.value.split("_")[0].split(".")[0]+'.'+checkbox.value.split("_")[0].split(".")[1]+'.') {
                    checkbox_sub.checked = mainCheckbox.checked;
                    console.log("5555555555",checkbox_sub.value.split("_")[0]!=checkbox.value.split("_")[0])
                    if(checkbox_sub.value.split("_")[0]!=checkbox.value.split("_")[0]){
                    checked_data = {
                        "S.No.": checkbox_sub.value.split("_")[0],
                        "Test Suite/Test Case": checkbox_sub.value.split("_")[1],
                        "Estimated Time (in Days)": checkbox_sub.value.split("_")[2]
                      }
                    }
                    if(mainCheckbox.checked && checkbox_sub.value.split("_")[0]!=checkbox.value.split("_")[0]){
                        const exists = selected_tests.some(item =>
                            item["S.No."] === checked_data["S.No."] &&
                            item["Test Suite/Test Case"] === checked_data["Test Suite/Test Case"] &&
                            item["Estimated Time (in Days)"] === checked_data["Estimated Time (in Days)"]
                          );
       
                          if (!exists) {
                        selected_tests.push(checked_data)
                          }
                        console.log("3333333",selected_tests)
                    }
                    else if(checkbox_sub.value.split("_")[0]!=checkbox.value.split("_")[0]){
                        // total_time -= parseFloat(mainCheckbox.value.split("_")[2]);
                        selected_tests = selected_tests.filter(test => test["S.No."] !== checkbox_sub.value.split("_")[0])
                    }
                }
            });
            if(mainCheckbox.checked){
                        total_time += parseFloat(mainCheckbox.value.split("_")[2]);
            }
            else{
                total_time -= parseFloat(mainCheckbox.value.split("_")[2]);

            }
       
      }
      else{
    if(checkbox.checked) {
        console.log("5555555555",checkbox.value.split("_")[0].split(".")[2]!=0,"66666666",total_time)
        if(checkbox.value.split("_")[0].split(".")[2]!=0){
        total_time += parseFloat(checkbox.value.split("_")[2]);
        selected_tests.push(test_data)
        }

    } else {
        if(checkbox.value.split("_")[0].split(".")[2]!=0){
        total_time -= parseFloat(checkbox.value.split("_")[2]);
        selected_tests = selected_tests.filter(test => test["S.No."] !== checkbox.value.split("_")[0]);
        }
    }
}
    total_time==0?document.getElementById('estimated_time').style.display="none":document.getElementById('estimated_time').style.display= "inline"
    total_time==0?document.getElementById('pdf_button').style.display="none":document.getElementById('pdf_button').style.display= "inline"
    document.getElementById('estimated_time').innerHTML = `Total Estimated Time in Days: ${total_time}`;
    create_testcase_table(selected_tests,true)
}
