/* window.addEventListener('load', () => {
    refreshInventoryTable();
    refreshFilterForm();
})

const refreshInventoryTable = () => {
    inventories = getServiceAjaxRequest("/inventory/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'serialno' },
        { dataType: 'function', propertyName: getCategoryId },
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'function', propertyName: getStatus },
    ];

    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableInventory, inventories, displayPropertyList, refillFilterForm)
        //table show with dataTable
    $('#tableInventory').dataTable();
}

const refreshFilterForm = () => {
    route = "";

    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", categories, "name")

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Select Item Brand", brands, "name")


    selectCategory.addEventListener('change', () => {
        let selectedCategory = selectValueHandler(selectCategory);
        let selectedBrand = selectValueHandler(selectBrand);

        cpusockets = getServiceAjaxRequest("/cpusocket/alldata");
        fillDataIntoSelect(selectCpuSocket, "Select CPU Socket", cpusockets, "name")

        cpuseries = getServiceAjaxRequest("/cpuseries/alldata");
        fillDataIntoSelect(selectCpuSeries, "Select CPU Series", cpuseries, "name")

        cpugenerations = getServiceAjaxRequest("/cpugeneration/alldata");
        fillDataIntoSelect(selectCpuGeneration, "Select CPU Socket", cpusockets, "name")

        cpusuffixs = getServiceAjaxRequest("/cpusuffix/alldata");
        fillDataIntoSelect(selectCpuSuffix, "Select CPU Suffix", cpusuffixs, "name")

        route = `/${(selectedCategory.name).toLowerCase()}/filteritem?brand_id=${selectedBrand.id}`

        if (selectedCategory.name == "Processor") {
            console.log("Processor Selected");
            //show/hide fields
            elementHide([casingSection, motherboardSection, memorySection, gpuSection, powerSupplySection, coolerSection, storageSection], true)
            elementHide([processorSection], false)

            route = `/${(selectedCategory.name).toLowerCase()}/filteritem?brand_id=${selectedBrand.id}&totalcore=${numberCpuTotalCore?.value}&cache=${numbercache?.value}`

            console.log("Route being set:", route);

        }
        if (selectedCategory.name == "Motherboard") {
            console.log("Motherboard Selected")
            elementHide([processorSection, casingSection, memorySection, gpuSection, powerSupplySection, coolerSection, storageSection], true)
            elementHide([motherboardSection], false)

        }

        if (selectedCategory.name == "Memory") {
            elementHide([processorSection, casingSection, motherboardSection, gpuSection, powerSupplySection, coolerSection, storageSection], true)
            elementHide([memorySection], false)

        }

        if (selectedCategory.name == "GPU") {
            elementHide([processorSection, casingSection, motherboardSection, memorySection, gpuSection, powerSupplySection, coolerSection, storageSection], true)
            elementHide([], false)

        }

        if (selectedCategory.name == "PowerSupply") {
            elementHide([processorSection, casingSection, motherboardSection, memorySection, gpuSection, coolerSection, storageSection], true)
            elementHide([powerSupplySection], false)

        }

        if (selectedCategory.name == "Cooler") {
            elementHide([processorSection, casingSection, motherboardSection, memorySection, gpuSection, powerSupplySection, storageSection], true)
            elementHide([coolerSection], false)

        }

        if (selectedCategory.name == "Storage") {
            elementHide([processorSection, casingSection, motherboardSection, memorySection, gpuSection, powerSupplySection, coolerSection], true)
            elementHide([storageSection], false)

        }

        if (selectedCategory.name == "Casing") {
            elementHide([processorSection, motherboardSection, memorySection, gpuSection, powerSupplySection, coolerSection, storageSection], true)
            elementHide([casingSection], false)
        }

        if (selectedCategory.name == "Accessories") {
            elementHide([processorSection, motherboardSection, memorySection, gpuSection, powerSupplySection, coolerSection, storageSection, casingSection], true)
        }

    })
}


const getCategoryId = (ob) => {
    return ob.category_id.name;
}

const getStatus = (ob) => {
    if (ob.status) {
        return '<p class="common-status-available"> Available</p>';
    } else {
        return '<p class="common-status-delete">Not Available</p>'
    }
}

const refillFilterForm = () => {

}

const applyFilterHandler = () => {
    console.log("ROUTE>>>>>", route)
    filteredItems = getServiceAjaxRequest(route)
} */


window.addEventListener('load', () => {
    refreshInventoryTable();
    refreshFilterForm();
})

const refreshInventoryTable = () => {
    inventories = getServiceAjaxRequest("/inventory/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'serialno' },
        { dataType: 'function', propertyName: getCategoryId },
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'text', propertyName: 'quantity' },
        { dataType: 'function', propertyName: getStatus },
    ];

    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableInventory, inventories, displayPropertyList, refillFilterForm)
        //table show with dataTable
    $('#tableInventory').dataTable();
}

const refreshFilterForm = () => {
    route = "";

    // Load general dropdown data
    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", categories, "name")

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Select Item Brand", brands, "name")

    // Hide all specific sections on first load - only show general details
    hideAllSections();

    // Clear any existing event listeners to prevent duplicates
    selectCategory.removeEventListener('change', handleCategoryChange);
    selectBrand.removeEventListener('change', handleBrandChange);

    // Add event listeners
    selectCategory.addEventListener('change', handleCategoryChange);
    selectBrand.addEventListener('change', handleBrandChange);
}

const handleCategoryChange = () => {
    let selectedCategory = selectValueHandler(selectCategory);

    if (!selectedCategory || !selectedCategory.name) {
        hideAllSections();
        return;
    }

    // Load brands specific to the selected category
    brandsByCategory = getServiceAjaxRequest(`/brand/brandbycategory/${selectedCategory.name}`)
    fillDataIntoSelect(selectBrand, "Select Item Brand", brandsByCategory, "name")

    // Build base route
    route = `/${(selectedCategory.name).toLowerCase()}/filteritem`;

    // Show relevant section based on category and load dropdown data
    switch (selectedCategory.name) {
        case "Processor":
            console.log("Processor Selected");
            hideAllSections();
            elementShow([processorSection]);
            loadProcessorDropdownData();
            break;

        case "Motherboard":
            console.log("Motherboard Selected");
            hideAllSections();
            elementShow([motherboardSection]);
            loadMotherboardDropdowns();
            break;

        case "Memory":
            console.log("Memory Selected");
            hideAllSections();
            elementShow([memorySection]);
            loadMemoryDropdowns();
            break;

        case "GPU":
            console.log("GPU Selected");
            hideAllSections();
            elementShow([gpuSection]);
            loadGpuDropdowns();
            break;

        case "PowerSupply":
            console.log("PowerSupply Selected");
            hideAllSections();
            elementShow([powerSupplySection]);
            loadPowerSupplyDropdowns();
            break;

        case "Cooler":
            console.log("Cooler Selected");
            hideAllSections();
            elementShow([coolerSection]);
            loadCoolerDropdowns();
            break;

        case "Storage":
            console.log("Storage Selected");
            hideAllSections();
            elementShow([storageSection]);
            loadStorageDropdowns();
            break;

        case "Casing":
            console.log("Casing Selected");
            hideAllSections();
            elementShow([casingSection]);
            loadCasingDropdowns();
            break;

        case "Accessories":
            console.log("Accessories Selected");
            hideAllSections();
            // No specific section for accessories
            break;

        default:
            console.log("Unknown category selected");
            hideAllSections();
    }

    // Update route with current brand selection
    updateRouteWithBrand();

    console.log("Route being set:", route);
}

const handleBrandChange = () => {
    updateRouteWithBrand();
}

const updateRouteWithBrand = () => {
    let selectedCategory = selectValueHandler(selectCategory);
    let selectedBrand = selectValueHandler(selectBrand);

    if (selectedCategory && selectedCategory.name) {
        route = `/${(selectedCategory.name).toLowerCase()}/filteritem`;

        // Add brand filter if selected
        if (selectedBrand && selectedBrand.id) {
            route += `?brand_id=${selectedBrand.id}`;
        }
    }
}

// Fixed element hide/show functions
const elementHide = (elements) => {
    elements.forEach((element) => {
        if (element) {
            element.classList.add("elementHide");
        }
    });
}

const elementShow = (elements) => {
    elements.forEach((element) => {
        if (element) {
            element.classList.remove("elementHide");
        }
    });
}

const hideAllSections = () => {
    const allSections = [
        processorSection,
        motherboardSection,
        memorySection,
        gpuSection,
        powerSupplySection,
        coolerSection,
        storageSection,
        casingSection
    ];
    elementHide(allSections);
}

const loadProcessorDropdownData = () => {
    // Load CPU related data
    cpusockets = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select CPU Socket", cpusockets, "name");

    cpuseries = getServiceAjaxRequest("/cpuseries/alldata");
    fillDataIntoSelect(selectCpuSeries, "Select CPU Series", cpuseries, "name");

    cpugenerations = getServiceAjaxRequest("/cpugeneration/alldata");
    fillDataIntoSelect(selectCpuGeneration, "Select CPU Generation", cpugenerations, "name");

    cpusuffixs = getServiceAjaxRequest("/cpusuffix/alldata");
    fillDataIntoSelect(selectCpuSuffix, "Select CPU Suffix", cpusuffixs, "name");
}

const loadMotherboardDropdowns = () => {
    // Load motherboard-specific dropdowns
    motherboardSeries = getServiceAjaxRequest("/motherboardseries/alldata");
    fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

    motherboardTypes = getServiceAjaxRequest("/motherboardtype/alldata");
    fillDataIntoSelect(selectotherboardType, "Select Motherboard Type", motherboardTypes, "name");

    motherboardFormFactors = getServiceAjaxRequest("/motherboardformfactor/alldata");
    fillDataIntoSelect(selectMotherboardFormFactor, "Select Motherboard Form Factor", motherboardFormFactors, "name");

    memoryTypes = getServiceAjaxRequest("/memorytype/alldata");
    fillDataIntoSelect(selectMotherboardMemoryType, "Select Memory Type", memoryTypes, "name");

    interfaces = getServiceAjaxRequest("/interface/alldata");
    fillDataIntoSelect(selectMBoardInterface, "Select Interface", interfaces, "name");

    // Load CPU sockets for motherboard
    cpusockets = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectMboardCpuSocket, "Select CPU Socket", cpusockets, "name");
}

const loadMemoryDropdowns = () => {
    memoryFormFactors = getServiceAjaxRequest("/memoryformfactor/alldata");
    fillDataIntoSelect(selectMemoryFormFactor, "Select Memory Form Factor", memoryFormFactors, "name");

    memoryTypes = getServiceAjaxRequest("/memorytype/alldata");
    fillDataIntoSelect(selectMemoryType, "Select Memory Type", memoryTypes, "name");
}

const loadGpuDropdowns = () => {
    gpuChipsets = getServiceAjaxRequest("/gpuchipset/alldata");
    fillDataIntoSelect(selectGpuChipset, "Select GPU Chipset", gpuChipsets, "name");

    gpuSeries = getServiceAjaxRequest("/gpuseries/alldata");
    fillDataIntoSelect(selectGpuSeries, "Select GPU Series", gpuSeries, "name");

    capacities = getServiceAjaxRequest("/capacity/alldata");
    fillDataIntoSelect(selectGpuCapacity, "Select Capacity", capacities, "name");

    gpuTypes = getServiceAjaxRequest("/gputype/alldata");
    fillDataIntoSelect(selectGpuType, "Select GPU Type", gpuTypes, "name");

    interfaces = getServiceAjaxRequest("/interface/alldata");
    fillDataIntoSelect(selectGpuInterface, "Select Interface", interfaces, "name");

    motherboardFormFactors = getServiceAjaxRequest("/motherboardformfactor/alldata");
    fillDataIntoSelect(selectGpuMotherboardFormFactor, "Select Motherboard Form Factor", motherboardFormFactors, "name");
}

const loadPowerSupplyDropdowns = () => {
    modularities = getServiceAjaxRequest("/modularity/alldata");
    fillDataIntoSelect(selectPsuModularity, "Select Modularity", modularities, "name");

    efficiencies = getServiceAjaxRequest("/efficiency/alldata");
    fillDataIntoSelect(selectPsuEfficiency, "Select Efficiency", efficiencies, "name");

    powerSupplyFormFactors = getServiceAjaxRequest("/powersupplyformfactor/alldata");
    fillDataIntoSelect(selectPowerSupplyFormFactor, "Select Power Supply Form Factor", powerSupplyFormFactors, "name");
}

const loadCoolerDropdowns = () => {
    coolerTypes = getServiceAjaxRequest("/coolertype/alldata");
    fillDataIntoSelect(selectCoolerType, "Select Cooler Type", coolerTypes, "name");

    // Load CPU sockets for cooler
    cpusockets = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCoolerCpuSocket, "Select CPU Socket", cpusockets, "name");
}

const loadStorageDropdowns = () => {
    storageInterfaces = getServiceAjaxRequest("/storageinterface/alldata");
    fillDataIntoSelect(selectStorageInterface, "Select Storage Interface", storageInterfaces, "name");

    storageTypes = getServiceAjaxRequest("/storagetype/alldata");
    fillDataIntoSelect(selectStorageType, "Select Storage Type", storageTypes, "name");

    storageCapacities = getServiceAjaxRequest("/capacity/alldata");
    fillDataIntoSelect(selectStorageCapacity, "Select Capacity", storageCapacities, "name");
}

const loadCasingDropdowns = () => {
    casingColors = getServiceAjaxRequest("/casecolor/alldata");
    fillDataIntoSelect(selectCasingColor, "Select Case Color", casingColors, "name");

    casingMaterials = getServiceAjaxRequest("/casematerial/alldata");
    fillDataIntoSelect(selectCasingMaterial, "Select Case Material", casingMaterials, "name");

    // Load motherboard form factors for casing
    motherboardFormFactors = getServiceAjaxRequest("/motherboardformfactor/alldata");
    fillDataIntoSelect(selectCasingMotherboardFormFactor, "Select Motherboard Form Factor", motherboardFormFactors, "name");
}

// Filter building functions
const addProcessorFilters = () => {
    let params = [];

    if (numberCpuTotalCore && numberCpuTotalCore.value) {
        params.push(`totalcore=${numberCpuTotalCore.value}`);
    }
    if (numberCpuCache && numberCpuCache.value) {
        params.push(`cache=${numberCpuCache.value}`);
    }

    let cpuSocket = selectValueHandler(selectCpuSocket);
    console.log("cpuSocket SELECTION: ", cpuSocket)
    if (cpuSocket && cpuSocket != "Select CPU Socket" && cpuSocket.id) {
        params.push(`cpusocket_id=${cpuSocket.id}`);
    }

    let cpuSeries = selectValueHandler(selectCpuSeries);
    console.log("cpuSeries SELECTION: ", cpuSeries)
    if (cpuSeries && cpuSeries != "Select CPU Series" && cpuSeries.id) {
        params.push(`cpuseries_id=${cpuSeries.id}`);
    }

    let cpuGeneration = selectValueHandler(selectCpuGeneration);
    console.log("cpuGeneration SELECTION: ", cpuGeneration)
    if (cpuGeneration && cpuGeneration != "Select CPU Generation" && cpuGeneration.id) {
        params.push(`cpugeneration_id=${cpuGeneration.id}`);
    }

    let cpuSuffix = selectValueHandler(selectCpuSuffix);
    console.log("cpuSuffix SELECTION: ", cpuSuffix)
    if (cpuSuffix && cpuSuffix != "Select CPU Suffix" && cpuSuffix.id) {
        params.push(`cpusuffix_id=${cpuSuffix.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("CPU ROUTE", route)
}

const addMotherboardFilters = () => {
    let params = [];

    if (numberMboardMaxCapacity && numberMboardMaxCapacity.value) {
        params.push(`maxcapacity=${numberMboardMaxCapacity.value}`);
    }

    let cpuSocket = selectValueHandler(selectMboardCpuSocket);
    console.log("cpuSocket SELECTION: ", cpuSocket)
    if (cpuSocket && cpuSocket.id) {
        params.push(`cpusocket_id=${cpuSocket.id}`);
    }

    let motherboardSeries = selectValueHandler(selectMotherboardSeries);
    console.log("motherboardSeries SELECTION: ", motherboardSeries)
    if (motherboardSeries && motherboardSeries.id) {
        params.push(`motherboardseries_id=${motherboardSeries.id}`);
    }

    let motherboardType = selectValueHandler(selectotherboardType);
    console.log("motherboardType SELECTION: ", motherboardType)
    if (motherboardType && motherboardType.id) {
        params.push(`motherboardtype_id=${motherboardType.id}`);
    }

    let motherboardFormFactor = selectValueHandler(selectMotherboardFormFactor);
    console.log("motherboardFormFactor SELECTION: ", motherboardFormFactor)
    if (motherboardFormFactor && motherboardFormFactor.id) {
        params.push(`motherboardformfactor_id=${motherboardFormFactor.id}`);
    }

    let memoryType = selectValueHandler(selectMotherboardMemoryType);
    console.log("memoryType SELECTION: ", memoryType)
    if (memoryType && memoryType.id) {
        params.push(`memorytype_id=${memoryType.id}`);
    }

    let interface = selectValueHandler(selectMBoardInterface);
    console.log("interface SELECTION: ", interface)
    if (interface && interface.id) {
        params.push(`interface_id=${interface.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("MBOARD ROUTE", route)
}

const addMemoryFilters = () => {
    let params = [];

    if (numberMemorySpeed && numberMemorySpeed.value) {
        params.push(`speed=${numberMemorySpeed.value}`);
    }
    let memoryCapacity = selectValueHandler(selectMemoryCapacity);
    if (memoryCapacity && memoryCapacity.id) {
        params.push(`capacity_id=${selectMemoryCapacity.id}`);
    }

    let memoryFormFactor = selectValueHandler(selectMemoryFormFactor);
    if (memoryFormFactor && memoryFormFactor.id) {
        params.push(`memoryformfactor_id=${memoryFormFactor.id}`);
    }

    let memoryType = selectValueHandler(selectMemoryType);
    if (memoryType && memoryType.id) {
        params.push(`memorytype_id=${memoryType.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("MEMORY ROUTE", route)
}

const addGpuFilters = () => {
    let params = [];

    let gpuInterface = selectValueHandler(selectGpuInterface);
    if (gpuInterface && gpuInterface.id) {
        params.push(`interface_id=${gpuInterface.id}`);
    }

    let gpuChipset = selectValueHandler(selectGpuChipset);
    if (gpuChipset && gpuChipset.id) {
        params.push(`gpuchipset_id=${gpuChipset.id}`);
    }

    let gpuSeries = selectValueHandler(selectGpuSeries);
    if (gpuSeries && gpuSeries.id) {
        params.push(`gpuseries_id=${gpuSeries.id}`);
    }

    let gpuCapacity = selectValueHandler(selectGpuCapacity);
    if (gpuCapacity && gpuCapacity.id) {
        params.push(`capacity_id=${gpuCapacity.id}`);
    }

    let gpuMotherboardFormFactor = selectValueHandler(selectGpuMotherboardFormFactor);
    if (gpuMotherboardFormFactor && gpuMotherboardFormFactor.id) {
        params.push(`motherboardformfactor_id=${gpuMotherboardFormFactor.id}`);
    }

    let gpuType = selectValueHandler(selectGpuType);
    if (gpuType && gpuType.id) {
        params.push(`gputype_id=${gpuType.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("GPU ROUTE", route)
}

const addPowerSupplyFilters = () => {
    let params = [];

    let psuModularity = selectValueHandler(selectPsuModularity);
    if (psuModularity && psuModularity.id) {
        params.push(`modularity_id=${psuModularity.id}`);
    }

    let psuEfficiency = selectValueHandler(selectPsuEfficiency);
    if (psuEfficiency && psuEfficiency.id) {
        params.push(`efficiency_id=${psuEfficiency.id}`);
    }

    let powerSupplyFormFactor = selectValueHandler(selectPowerSupplyFormFactor);
    if (powerSupplyFormFactor && powerSupplyFormFactor.id) {
        params.push(`powersupplyformfactor_id=${powerSupplyFormFactor.id}`);
    }

    if (numberPsuWattage && numberPsuWattage.value) {
        params.push(`wattage=${numberPsuWattage.value}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("PSU ROUTE", route)
}

const addCoolerFilters = () => {
    let params = [];

    let coolerCpuSocket = selectValueHandler(selectCoolerCpuSocket);
    if (coolerCpuSocket && coolerCpuSocket.id) {
        params.push(`cpusocket_id=${coolerCpuSocket.id}`);
    }

    let coolerType = selectValueHandler(selectCoolerType);
    if (coolerType && coolerType.id) {
        params.push(`coolertype_id=${coolerType.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("COOLER ROUTE", route)
}

const addStorageFilters = () => {
    let params = [];

    let storageInterface = selectValueHandler(selectStorageInterface);
    if (storageInterface && storageInterface.id) {
        params.push(`storageinterface_id=${storageInterface.id}`);
    }

    let storageType = selectValueHandler(selectStorageType);
    if (storageType && storageType.id) {
        params.push(`storagetype_id=${storageType.id}`);
    }

    let storageCapacity = selectValueHandler(selectStorageCapacity);
    if (storageCapacity && storageCapacity.id) {
        params.push(`capacity_id=${storageCapacity.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }
    console.log("STORAGE ROUTE", route)
}

const addCasingFilters = () => {
    let params = [];

    if (numberCasingWidth && numberCasingWidth.value) {
        params.push(`width=${numberCasingWidth.value}`);
    }
    if (numberCasingHeight && numberCasingHeight.value) {
        params.push(`height=${numberCasingHeight.value}`);
    }
    if (numberCasingDepth && numberCasingDepth.value) {
        params.push(`depth=${numberCasingDepth.value}`);
    }

    let casingMotherboardFormFactor = selectValueHandler(selectCasingMotherboardFormFactor);
    if (casingMotherboardFormFactor && casingMotherboardFormFactor.id) {
        params.push(`motherboardformfactor_id=${casingMotherboardFormFactor.id}`);
    }

    let casingColor = selectValueHandler(selectCasingColor);
    if (casingColor && casingColor.id) {
        params.push(`casecolor_id=${casingColor.id}`);
    }

    let casingMaterial = selectValueHandler(selectCasingMaterial);
    if (casingMaterial && casingMaterial.id) {
        params.push(`casematerial_id=${casingMaterial.id}`);
    }

    if (params.length > 0) {
        route += (route.includes('?') ? '&' : '?') + params.join('&');
    }

    console.log("CASE ROUTE", route)
}

// Utility functions
const getCategoryId = (ob) => {
    return ob.category_id.name;
}

const getStatus = (ob) => {
    if (ob.status) {
        return '<p class="common-status-available"> Available</p>';
    } else {
        return '<p class="common-status-delete">Not Available</p>'
    }
}

const refillFilterForm = () => {
    // Reset form when needed
    if (document.getElementById('filterForm')) {
        document.getElementById('filterForm').reset();
    }
    hideAllSections();
    route = "";
}

const applyFilterHandler = () => {
    console.log("ROUTE>>>>>", route);

    if (route) {
        try {
            // Add filters based on current category
            let selectedCategory = selectValueHandler(selectCategory);
            if (selectedCategory && selectedCategory.name) {
                switch (selectedCategory.name) {
                    case "Processor":
                        addProcessorFilters();
                        break;
                    case "Motherboard":
                        addMotherboardFilters();
                        break;
                    case "Memory":
                        addMemoryFilters();
                        break;
                    case "GPU":
                        addGpuFilters();
                        break;
                    case "PowerSupply":
                        addPowerSupplyFilters();
                        break;
                    case "Cooler":
                        addCoolerFilters();
                        break;
                    case "Storage":
                        addStorageFilters();
                        break;
                    case "Casing":
                        addCasingFilters();
                        break;
                }
            }

            console.log("Final ROUTE>>>>>", route);

            // Get filtered items from the specific category endpoint
            filteredItems = getServiceAjaxRequest(route);
            console.log("Filtered items from category:", filteredItems);

            // Extract item codes from filtered items
            const filteredItemCodes = filteredItems.map(item => item.itemcode);
            console.log("Filtered item codes:", filteredItemCodes);

            // Filter the inventory based on the item codes
            const filteredInventory = inventories.filter(inventory =>
                filteredItemCodes.includes(inventory.itemcode) && inventory.status != false
            );
            console.log("Filtered inventory:", filteredInventory);

            // Update the table with filtered inventory results
            const displayPropertyList = [
                { dataType: 'text', propertyName: 'serialno' },
                { dataType: 'function', propertyName: getCategoryId },
                { dataType: 'text', propertyName: 'itemcode' },
                { dataType: 'text', propertyName: 'itemname' },
                { dataType: 'text', propertyName: 'salesprice' },
                { dataType: 'function', propertyName: getStatus },
            ];

            // Clear existing table
            $('#tableInventory').DataTable().destroy();

            // Refill table with filtered inventory data
            fillDataIntoTable(tableInventory, filteredInventory, displayPropertyList, refillFilterForm);

            // Reinitialize DataTable
            $('#tableInventory').DataTable();

            console.log("Table updated with filtered inventory");
        } catch (error) {
            console.error("Error applying filter:", error);
            alert("Error applying filter. Please try again.");
        }
    } else {
        alert("Please select a category to filter.");
    }
}