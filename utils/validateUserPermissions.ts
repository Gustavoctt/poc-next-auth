type User = {
  permissions: string[];
  roles: string[];
}


type ValidationPermissionsParams = {
  user: User,
  permissions?: string[],
  roles?: string[]
}

export function validateUserPermissions({ user, permissions, roles }: ValidationPermissionsParams){
  if(permissions?.length > 0){
    const hasAllPermissions = permissions.every(permission => {
      return user.permissions.includes(permission)
    })

    if(!hasAllPermissions){
      return false;
    }
  }

  if(roles?.length > 0){
    const hasRole = roles.some(role => {
      return user.roles.includes(role)
    })

    if(!hasRole){
      return false;
    }
  }

  return true;
}