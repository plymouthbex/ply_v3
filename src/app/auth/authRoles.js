export const authRoles = {
    sa: ['SYSTEMADMIN'], // Only Super Admin has access
    admin:['ADMIN','SYSTEMADMIN'],  // Only  Admin and SA has access
    user:['USER','ADMIN','SYSTEMADMIN'] , // Only User & Admin  and SA has access
}