import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps{
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function Can({ children, permissions, roles }: CanProps){
  //Hook de visualização da página
  const hasUserCanSeeComponent = useCan({ permissions, roles })

  if(!hasUserCanSeeComponent){
    return null;
  }

  return(
    <>
      {children}
    </>
  )
}