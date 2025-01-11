function canViewProject(project, user) {
    return user.role === ROLES.ADMIN || user.id === project.managerId;
}

function canEditProject(project, user) {
    return user.id === project.managerId;
}

module.exports = {
    canViewProject,
    canEditProject
}