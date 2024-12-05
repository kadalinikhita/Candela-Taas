var total_time = 0;
var selected_tests=[]
function modify(checkbox) {
    const test_data = {
        "S.No.": checkbox.value.split("_")[0],
        "Test Suite/Test Case": checkbox.value.split("_")[1],
        "Estimated Time (in Days)": checkbox.value.split("_")[2]
    };

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const parentKey = checkbox.value.split("_")[0].split(".").slice(0, 2).join(".") + ".0"; // Example: "1.1.0"
    const mainCheckbox = document.getElementById(parentKey);

    if (checkbox.value.split("_")[0].split(".")[2] == 0) {
        // total_time=0
        if (checkbox.checked) {
            total_time += parseFloat(checkbox.value.split("_")[2]);}
        // Handle parent checkbox toggle logic
        checkboxes.forEach(checkbox_sub => {
            console.log("444444",checkbox_sub,mainCheckbox)
            const isSameParent = checkbox_sub.value.split("_")[0].startsWith(parentKey.split(".").slice(0, 2).join(".") + ".");
            if (isSameParent && checkbox_sub !== checkbox) {
                if(checkbox_sub.checked){
                    console.log("9999999999",checkbox_sub.value.split("_")[2])
                    total_time -= parseFloat(checkbox_sub.value.split("_")[2])
                }
                checkbox_sub.checked = checkbox.checked;
                handleCheckboxState(checkbox_sub, checkbox.checked);
            }
        });

        // Skip adding parent checkbox data to selected_tests
    } else {
        // Handle child checkbox toggle logic
        if (checkbox.checked) {
            total_time += parseFloat(checkbox.value.split("_")[2]);}
            else {
                total_time -= parseFloat(checkbox.value.split("_")[2]);}
        handleCheckboxState(checkbox, checkbox.checked);

        // Check if all children of the same parent are checked
        const allChildrenChecked = Array.from(checkboxes).every(checkbox_sub => {
            const isChild = checkbox_sub.value.split("_")[0].startsWith(parentKey.split(".").slice(0, 2).join(".") + ".");
            const isParent = checkbox_sub.value.split("_")[0] === parentKey;
            return isParent || (!isParent && (!isChild || checkbox_sub.checked));
        });

        mainCheckbox.checked = allChildrenChecked;
    }

    // Update total time display
    document.getElementById('estimated_time').style.display = total_time === 0 ? "none" : "inline";
    document.getElementById('pdf_button').style.display = total_time === 0 ? "none" : "inline";
    document.getElementById('estimated_time').innerHTML = `Total Estimated Time in Days: ${total_time}`;
    create_testcase_table(selected_tests, true);
}

function handleCheckboxState(checkbox, isChecked) {
    const test_data = {
        "S.No.": checkbox.value.split("_")[0],
        "Test Suite/Test Case": checkbox.value.split("_")[1],
        "Estimated Time (in Days)": checkbox.value.split("_")[2]
    };

    // Skip adding items with S.No. ending in ".0"
    if (test_data["S.No."].split(".")[2] == 0) {
        return;
    }

    if (isChecked) {
        // total_time += parseFloat(checkbox.value.split("_")[2]);
        const exists = selected_tests.some(item =>
            item["S.No."] === test_data["S.No."] &&
            item["Test Suite/Test Case"] === test_data["Test Suite/Test Case"] &&
            item["Estimated Time (in Days)"] === test_data["Estimated Time (in Days)"]
        );

        if (!exists) {
            selected_tests.push(test_data);
        }
    } else {
        // total_time -= parseFloat(checkbox.value.split("_")[2]);
        selected_tests = selected_tests.filter(test => test["S.No."] !== test_data["S.No."]);
    }
}

function create_testcase_table(testcases,selected=false,stage="") {
    console.log("Inside cerate testcase")
    let table_data = '';
    testcases.map((value, index) => {
        values = Object.values(value);
        keys = Object.keys(value);
        if(index == 0) {
            table_data += `
                <thead class="fixed_header">
                    <tr>
                    ${!selected ?'<th rowspan="2">Select</th>':''}
                        <th rowspan="2">
                            ${keys[0]}
                        </th>
                        <th colspan="2">
                            ${stage} Lab Testing with Virtual Clients
                        </th>
                    </tr>
                    <tr>
                        <th>
                            ${keys[1]}
                        </th>
                        <th>
                            ${keys[2]}
                        </th>
                    </tr>
                </thead>
                <tbody>
            `
        } 
           
            table_data += `
                <tr style="${values[0].split(".")[2] == 0 || values[0].split(".")[3] == 0? 'background-color: #eafaf1; font-weight: bold;' : ''}">
                ${!selected ? `<td><input type='checkbox' value='${values[0]+'_'+values[1]+'_'+values[2]}' id='${values[0]}' onclick='modify(this);'>
                    </td>`:''
                    }
                    <td>
                        ${values[0]}
                    </td>
                    <td>
                        ${values[1]}
                    </td>
                    <td>
                        ${values[2]}
                    </td>
                </tr>
            `
        
    })
    table_data += '</tbody>';
    console.log("STAGE",stage)
    !selected?document.getElementById(stage).innerHTML = table_data:document.getElementById('selected_stages').innerHTML = table_data;
    
}


async function fetchTestcases() {
    for(i=1;i<=3;i++){
    try {
      response = await fetch(`testcases_stage${i}.json`);
      testcases_stage = await response.json();
      
      create_testcase_table(testcases_stage,false,`Stage${i}`);
    } catch (error) {
      console.error('Error fetching the CSV:', error);
    }
  }
}
function downloadPDF() {
    console.log("4444444444",selected_tests)
    const data=[]
    selected_tests.map((value, index) => {
        values = Object.values(value);
        keys = Object.keys(value);
        data.push(values)

    })
    data.push([" ","Total estimated time(in days)",total_time])
    console.log("333333333",data)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const bannerImageUrl = "banner2.png"; 
            const img = new Image();
            img.src = bannerImageUrl;

            img.onload = function () {
                doc.addImage(img, "JPEG", 10, 10, 190, 25); 

             
                doc.setDrawColor(0, 128, 0);
                doc.line(10, 40, 200, 40);

                doc.setFont("helvetica","bold");
                doc.setFontSize(10);
                doc.setTextColor(44, 95, 45); 
                doc.text("Lab Testing Summary", 40, 50, null, null, "center");

   
    const headers = [["S.No.", "Test Suite/Test Case", "Estimated Time (in Days)"]];

    

    // Add table to the PDF
    doc.autoTable({
        startY: 60,
        head: headers,
        body: data,
        headStyles: { fillColor: [57, 133, 75] },
        bodyStyles: { textColor: [0, 0, 0] }, // Default body text color
        willDrawCell: function (data) {
            if (data.row.index === selected_tests.length) {
                doc.setFillColor(250,240,230); // Light lavender background
                doc.setFont("helvetica");
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F"); // Fill background
            }
        },
    });
    // const finalY = doc.lastAutoTable.finalY;

    // doc.setFontSize(10);
    // doc.setTextColor(44, 95, 45);
    // doc.text(`Total Estimated Time (in Days): ${total_time}`, 137, finalY + 10);

    // Save PDF
    doc.save("Lab_Testing_Table.pdf");
}
}

// Fetch the data
fetchTestcases()
