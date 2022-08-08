import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions";

type useCanProps = {
  permissions?: string[],
  roles?: string[]
}

export function useCan({ permissions, roles }: useCanProps){
  const { isAuthenticated, user } = useContext(AuthContext);

  if(!isAuthenticated){
    return false;
  }

  const hasAllPermissions = validateUserPermissions({
    user,
    permissions,
    roles
  })

  return hasAllPermissions;
}