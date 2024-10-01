const navigatorList = [
    { id: 1, labelName: 'Employee Management', linkUrl: '/employee', icon: '<i class="fas fa-users text-white"></i>' },
    { id: 2, labelName: 'User Management', linkUrl: '/user', icon: '<i class="fas fa-user text-white"></i>' }
];


document.addEventListener("DOMContentLoaded", function() {



    let accessedModules = getServiceAjaxRequest("/module/listbyloggeduser")

    // Ensure sidebarUL exists before appending
    const sidebarUL = document.getElementById('sidebarUL');
    if (sidebarUL && accessedModules) {
        accessedModules.forEach(element => {
            let module = element.toLowerCase();
            let href = document.createElement('a');
            href.innerText = element;
            href.href = `/${module}`;
            sidebarUL.appendChild(href);
        });
    } else {
        console.error("SidebarUL element or accessedModules data not found");
    }
});