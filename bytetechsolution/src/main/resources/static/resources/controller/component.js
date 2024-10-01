const navigatorData = {
    name: "appNavigator",
    display: "Navigator",
    navigators: [{
            icon: "<i class='fas fa-users'></i>",
            name: "EMPLOYEE",
            label: "Employee Management",
            page: "/employee",
            children: null,
        },
        {
            icon: "<i class='fas fa-user'></i>",
            name: "USER",
            label: "User Management",
            page: "/user",
            children: null,
        },
        {
            icon: "<i class='fas fa-key'></i>",
            name: "PRIVILAGE",
            label: "Privilage Management",
            page: "/privilage",
            children: null,
        },
        {
            icon: "<i class='fas fa-users'></i>",
            name: "ITEM",
            label: "Item Management",
            page: null,
            children: [{
                    icon: '<i class="fas fa-microchip"></i>',
                    name: "PROCESSOR",
                    label: "Processor",
                    page: "/processor",
                    children: null
                },
                {
                    icon: '<i class="fas fa-network-wired"></i>',
                    name: "MOTHERBOARD",
                    label: "Motherboard",
                    page: "/motherboard",
                    children: null
                },
                {
                    icon: '<i class="fas fa-memory"></i>',
                    name: "MEMORY",
                    label: "Memory",
                    page: "/memory",
                    children: null
                },
                {
                    icon: '<i class="fas fa-gamepad"></i>',
                    name: "GPU",
                    label: "Graphic Card",
                    page: "/gpu",
                    children: null
                },
                {
                    icon: '<i class="fas fa-hdd"></i>',
                    name: "STORAGE",
                    label: "Storage",
                    page: "/storage",
                    children: null
                },
                {
                    icon: '<i class="fas fa-fan"></i>',
                    name: "COOLER",
                    label: "Cooler",
                    page: "/cooler",
                    children: null
                },
                {
                    icon: '<i class="fas fa-plug"></i>',
                    name: "POWERSUPPLY",
                    label: "Power Supply",
                    page: "/powesupply",
                    children: null
                },
                {
                    icon: '<i class="fas fa-plug"></i>',
                    name: "CASING",
                    label: "Casing",
                    page: "/casing",
                    children: null
                },
                {
                    icon: '<i class="fas fa-plug"></i>',
                    name: "MONITOR",
                    label: "Monitor",
                    page: "/monitor",
                    children: null
                },
            ]
        },
    ]
};

document.addEventListener("DOMContentLoaded", function() {
    // Simulate an Ajax call to get accessed modules
    let accessedModules = getServiceAjaxRequest("/module/listbyloggeduser"); // This should return an array of accessible module names

    // Check if the accessedModules is an array
    if (!Array.isArray(accessedModules)) {
        console.error("Accessed modules data is not an array");
        return;
    }

    // Ensure sidebarUL exists before appending
    const sidebarUL = document.getElementById('sidebarUL');
    if (sidebarUL) {
        navigatorData.navigators.forEach(item => {
            // Check if the main item is accessible
            if (accessedModules.includes(item.name)) {
                let listItem = document.createElement('li');
                listItem.classList.add('nav-item');

                let link = document.createElement('a');
                link.classList.add('nav-link');
                link.href = item.page || '#'; // Fallback to '#' if no page is defined
                link.innerHTML = `${item.icon} <span>${item.label}</span>`;
                listItem.appendChild(link);
                sidebarUL.appendChild(listItem);

                // If the item has children, create a submenu
                if (item.children) {
                    let subMenu = document.createElement('ul');
                    subMenu.classList.add('submenu');

                    item.children.forEach(child => {
                        // Check if the child item is accessible
                        if (accessedModules.includes(child.name)) {
                            let subItem = document.createElement('li');
                            subItem.classList.add('nav-item');

                            let childLink = document.createElement('a');
                            childLink.classList.add('nav-link');
                            childLink.href = child.page || '#'; // Fallback to '#' if no page is defined
                            childLink.innerHTML = `${child.icon} <span>${child.label}</span>`;
                            subItem.appendChild(childLink);
                            subMenu.appendChild(subItem);
                        }
                    });

                    // Append the submenu to the main item
                    if (subMenu.children.length > 0) { // Only append if there are accessible children
                        listItem.appendChild(subMenu);
                    }
                }
            }
        });
    } else {
        console.error("SidebarUL element not found");
    }
});