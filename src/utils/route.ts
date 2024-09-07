import { lazy } from 'react';

export const routes = [
  { name: 'AdminList', path: lazy(() => import('~C/Basic/AdminList')) },
  { name: 'RoleList', path: lazy(() => import('~C/Basic/RoleList')) },
  { name: 'BasicInfo', path: lazy(() => import('~C/Set/BasicInfo')) },
  { name: 'MenuSet', path: lazy(() => import('~C/Set/MenuSet')) },
  { name: 'UploadSet', path: lazy(() => import('~C/Set/UploadSet')) },
  { name: 'OperationLog', path: lazy(() => import('~C/Set/OperationLog')) },
  // TODO: add your route here
]

export const Components = () => {
  let res: Record<string, React.LazyExoticComponent<any>> = {};
  routes.forEach((item) => {
    res[item.name] = item.path;
  });
  return res;
}
