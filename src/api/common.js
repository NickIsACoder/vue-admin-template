import { getDictionary, getPositionType } from '@/api/user'

/**
 * 获取数据字典方法
 * @param {string} code
 * @returns {Array}
 */
export function getDicList(code) {
  const arrList = []
  getDictionary(code).then((res) => {
    const list = res.data
    if (res.code === 0 && list.length > 0) {
      list.forEach((val) => {
        const temp = {}
        temp.value = val.code
        temp.label = val.msg
        arrList.push(temp)
      })
      return arrList
    }
  })
  return arrList
}

/**
 * 获取职位、所属行业类型
 * @param {string} codeNum
 * @returns {Array}
 */
export function getPosition(codeNum) {
  const arrList = []
  const pageNo = 1
  const pageSize = 100
  getPositionType(pageNo, pageSize, codeNum).then((res) => {
    const list = res.data.list
    if (res.code === 0 && list.length > 0) {
      list.forEach((val) => {
        const temp = {}
        temp.value = val.code
        temp.label = val.msg
        arrList.push(temp)
      })
      return arrList
    }
  })
  return arrList
}

