const navigatorList = [
    { id: 1, labelName: 'Employee Management', linkUrl: '/employee', icon: '<i class="fas fa-users text-white"/>' },
    { id: 2, labelName: 'User Management', linkUrl: '/user', icon: '<i class="fas fa-user text-white"/>' }
]

console.log("hi")
const sidebarUL = document.getElementById('sidebarUL');

sidebarUL.textContent = navigatorList.map((item) => {
    return `
        <button class="sidebar-btn" onclick="window.location.href='${item.linkUrl}'">
            ${item.icon} ${item.labelName}
        </button>
    `;
})