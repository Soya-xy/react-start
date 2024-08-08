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
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
  { name: 'Test', path: lazy(() => import('~C/Test/Test')) },
// TODO: add your route here
]

export const Components = () => {
  let res: Record<string, React.LazyExoticComponent<any>> = {};
  routes.forEach((item) => {
    res[item.name] = item.path;
  });
  return res;
}
