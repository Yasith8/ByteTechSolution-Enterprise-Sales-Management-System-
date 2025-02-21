const fillDataIntoTable = (tableId, dataList, displayPropertyList, refillFunction, divButton) => {

    //catch the static data that i added in ui design on table
    const tableBody = tableId.children[1];
    //empty the table body
    tableBody.innerHTML = '';


    //dataList contain all data comefrom db
    //foreach add for get data item by item in array
    dataList.forEach((element, index) => {
        //create table row element
        const tr = document.createElement('tr');

        //create table data element
        const tdIndex = document.createElement('td')
            //assign value for tdIndex as index value
            //because of index start in 0, use index+1
        tdIndex.innerText = index + 1;
        //add td into tr
        tr.appendChild(tdIndex);


        //iterate over each element in displayPropertyList array using foreach function
        displayPropertyList.forEach((ob, ind) => {
            //create td for add data item
            const td = document.createElement('td');

            //check data type of each obejcts
            //check if datatype = text
            if (ob.dataType == 'text') {
                /* 
                diff between innerText & textContent & innerHTML
                1- innerText only show plain text - <b>name</b>
                2- render the text- <b>name</b> bold(name)
                */

                /* 
                *set value for td --- use innerText or textContent to assiging values
                *element is dataList's data element (this is a single data what i get from employee array)
                *dynamicly access to the elemnt's object specify by propertyName

                in simple word assign value of current element's objects that key name = propertyName(ob)(in this object have 2 keys-(datatype,propertyname))
                 */
                td.innerText = element[ob.propertyName];
            }

            //check if datatype = function
            if (ob.dataType == 'function') {
                //set value(innerHTML) as ob.propertyName(element)
                //pass element data to propertyName function
                td.innerHTML = ob.propertyName(element);
            }

            //add td inside in tr
            tr.appendChild(td);
        });

        tr.onclick = () => {
            refillFunction(element, index);
            window['editOb'] = element;
            window['editRow'] = index;
            divButton.className = '';
        }

        //append tr into table body
        tableBody.appendChild(tr);
    });
}

const fillDataIntoInnerTable = (tableId, dataList, displayPropertyList, editButtonFunction, deleteButtonFunction, buttonVisibility = true) => {
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tdIndex.style.textAlign = "center";
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            if (ob.dataType == 'text') {
                td.innerText = element[ob.propertyName];
            }
            if (ob.dataType == 'function') {
                if (ob.propertyName != null) {
                    td.innerHTML = ob.propertyName(element);
                } else {
                    td.innerHTML = "-";
                }
            }
            if (ob.dataType == 'amount') {
                td.innerHTML = parseFloat(element[ob.propertyName]).toFixed(2);
            }
            if (ob.dataType == 'year') {
                td.innerHTML = String(element[ob.propertyName]).substring(0, 4);
            }


            td.style.textAlign = "center";
            tr.appendChild(td);

        });

        const tdButton = document.createElement('td'); // button column

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-edit fw-bold';
        editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        editButton.type = "button";

        editButton.onclick = function() {
            //console.log('edit');
            editButtonFunction(element, index);
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger fw-bold ms-1 me-1';
        deleteButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
        deleteButton.type = "button";

        deleteButton.onclick = function() {
            deleteButtonFunction(element, index);
        }



        tdButton.appendChild(editButton); // append button into table column 
        tdButton.appendChild(deleteButton); // append button into table column 
        tdButton.style.textAlign = "center";

        if (buttonVisibility) {
            tr.appendChild(tdButton); // append button column into table row
        } else {
            if (document.getElementById('tdModify') != undefined)
                tdModify.className = 'd-none';
        }

        tableBody.appendChild(tr); // append tr into table body



    });

}

//currentList = [{id:1, name:'name1'},{id:2, name:'name2'}]
//updatedList=[{id:1, name:'name1',class:'class1'},{id:2, name:'name2',class:'class2'}}]


const fillEditableInnerDataIntoTable = (tableId, dataList, modifiedList, displayPropertyList, printFunction) => {

    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            if (ob.dataType == 'text') {
                td.innerText = element[ob.propertyName];
            }
            if (ob.dataType == 'function') {
                if (ob.propertyName != null) {
                    td.innerHTML = ob.propertyName(element);
                } else {
                    td.innerHTML = "-";
                }
            }
            if (ob.dataType == 'amount') {
                td.innerHTML = parseFloat(element[ob.propertyName]).toFixed(2);
            }
            if (ob.dataType == 'year') {
                td.innerHTML = String(element[ob.propertyName]).substring(0, 4);
            }


            tr.appendChild(td);

        });

        const tdButton = document.createElement('td'); // button column


        const printButton = document.createElement('button');
        printButton.className = 'btn';
        printButton.innerHTML = '<i class="fa-solid fa-eye fa-beat "></i> ';

        printButton.onclick = function() {
            // console.log('print');
            printFunction(element, index);
        }


        tdButton.appendChild(editButton); // append button into table column 
        tdButton.appendChild(deleteButton); // append button into table column 
        tdButton.appendChild(printButton); // append button into table column


        tableBody.appendChild(tr); // append tr into table body



    });

}