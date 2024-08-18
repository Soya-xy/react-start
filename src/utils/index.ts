// deepClone
export const deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
};


export function getTreeData(data: any, key: any): any {
    // 遍历树结构
    for (let item of data) {
      // 如果找到匹配的项,直接返回
      if (item.key === key) {
        return item;
      }
      // 如果当前项有子节点,递归搜索
      if (item.children && item.children.length > 0) {
        const result = getTreeData(item.children, key);
        // 如果在子节点中找到匹配项,返回结果
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
