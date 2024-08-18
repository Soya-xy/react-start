import { lazy } from 'react';

export const routes = [
  { name: 'AdminList', path: lazy(() => import('~C/Basic/AdminList')) },
  { name: 'RoleList', path: lazy(() => import('~C/Basic/RoleList')) },
  { name: 'BasicInfo', path: lazy(() => import('~C/Set/BasicInfo')) },
  { name: 'MenuSet', path: lazy(() => import('~C/Set/MenuSet')) },
  { name: 'UploadSet', path: lazy(() => import('~C/Set/UploadSet')) },
  { name: 'OperationLog', path: lazy(() => import('~C/Set/OperationLog')) },
  { name: 'Goods', path: lazy(() => import('~C/Goods/Goods')) },
  { name: 'Orders', path: lazy(() => import('~C/Goods/Orders')) },
  { name: 'CodeGenerate', path: lazy(() => import('~C/CodeGenerate')) },
  { name: 'MyCustomer', path: lazy(() => import('~C/MyCustomer/MyCustomer')) },
  { name: 'MyImportant', path: lazy(() => import('~C/MyCustomer/MyImportant')) },
  { name: 'TeamImportant', path: lazy(() => import('~C/MyCustomer/TeamImportant')) },
  { name: 'Tag', path: lazy(() => import('~C/Tag/Tag')) },
  { name: 'Memo', path: lazy(() => import('~C/Memo/Memo')) },
  { name: 'Org', path: lazy(() => import('~C/Org/Org')) },
// TODO: add your route here
]

export const Components = () => {
  let res: Record<string, React.LazyExoticComponent<any>> = {};
  routes.forEach((item) => {
    res[item.name] = item.path;
  });
  return res;
}
