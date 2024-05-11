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