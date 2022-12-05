const Mock = require('mockjs');

/**
 * id 调整为 6 位  1 => 000001
 */
function formatId(id, len = 6) {
  id = String(id);
  while (id.length < len) {
    id = `0${id}`;
  }
  return id;
}

/**
 * 生成n个随机数且和等于100, 精度到小数点后1位
 */
function generateRandomNum(n = 5, sum = 100, exact = 1) {
  let arr = []
  while(n > 1) {
    let t = parseFloat((Math.random() * sum).toFixed(exact))
    arr.push(t)
    sum -= t
    n--
  }
  arr.push(parseFloat(sum.toFixed(exact)))
  return arr
}

/**
 * 生成对应分类的数据
 * @param {string} typeName 分类名称
 * @param {number} dataLen 要生成多少条数据
 * @returns 
 */
function generateData(typeName, dataLen = 9) {
  let list = []

  for (let index = 0; index < dataLen; index++) {
    list.push(Mock.mock({
      id: formatId(index + 1),
      // 电影名
      name: `${Mock.mock('@ctitle')}-${index+1}`,
      // 电影图片
      movieImage: Mock.Random.image('300x420', Mock.mock('@color'), Mock.mock('@color'), 'png', `${typeName}-${index+1}`),
      // 电影名下方信息
      title: {
        "type": "@shuffle([ '喜剧', '犯罪', '惊悚', '悬疑', '剧情', '传记', '历史', '动作', '动画' ], 2, 3)",
        "area": "@shuffle(['美国', '日本', '英国', '韩国' ], 1, 2)",
        "time|90-150": 90,
      },
      // 评分
      score: {
        'num|1-9.1': 1,
        scoreList: generateRandomNum(),
        "peopleNum|100-10000": 1
      },
      // 简介
      introduce: '@cparagraph(5, 10)',
      // 短评
      'shortComments': generateShortComments(15),
      // 长评论
      'movieComments': generateMovieComments(15),
      actor: () => {
        let res = []
        for (let index1 = 0; index1 < 8; index1++) {
          let name = Mock.Random.name()
          res.push(Mock.mock({
            name: name,
            avatar: Mock.Random.image('250x350', Mock.mock('@color'), '#fff', 'png', name),
            identity: index ? '演员' : '导演'
          }))
        }
        return res
      },
      stagePhoto: () => {
        let res = []
        for (let index = 0; index < 10; index++) {
          res.push(Mock.Random.image('320x200', Mock.mock('@color'), '#fff', 'png', `photo-${index+1}`),)
        }
        return res
      }
    }))
  }

  return list
}

/**
 * 生成短评论
 * @param {number} len 长度
 * @returns 
 */
function generateShortComments(len = 8) {
  let res = []
  for (let index1 = 0; index1 < len; index1++) {
    let name = Mock.Random.cname()
    res.push(Mock.mock({
      "date": '@date("MM-dd")',
      "rate|1-5": 1,
      user: name,
      avatar: Mock.Random.image('150x150', Mock.mock('@color'), '#fff', 'png', name),
      comment: '@cparagraph(1, 5)',
      'like|0-10000': 1
    }))
  }
  return res
}

/**
 * 生成电影长评
 * @param {number} len 长度
 * @returns 
 */
function generateMovieComments(len = 8) {
  let res = []
  for (let index1 = 0; index1 < 15; index1++) {
    let name = Mock.Random.cname()
    res.push(Mock.mock({
      user: name,
      avatar: Mock.Random.image('150x150', Mock.mock('@color'), '#fff', 'png', name),
      "rate|1-5": 1,
      comment: '@cparagraph(2, 8)',
      "reply|0-1000": 1,
      "useful|0-1000": 1,
      "transmit|0-1000": 1,
    }))
  }
  return res
}

/**
 * 获取列表的数据
 * @param {object} params 请求参数
 * @param {array} list 对应类别的列表
 */
function getList(params, list) {
  const total = list.length
  // 用于做分页
  const { showAll, pageSize, pageNum = 1 } = params
  if ((typeof showAll === 'string' && !(showAll === 'true')) || !showAll) {
    // 只提取需要的字段
    list = list.map(i => {
      return {
        id: i.id,
        name: i.name,
        score: i.score.num,
        movieImage: i.movieImage,
        title: i.title
      }
    })
  }
  if (pageSize) {
    list = list.slice((pageNum-1) * pageSize, pageSize * pageNum)
  }
  return {list, total}
}

/**
 * 根据id返回对应详情信息
 * @param {object} params 请求参数
 * @param {array} list 
 */
function searchById(params, list) {
  const { id } = params
  const data = list.filter(i => i.id === id)
  if (data.length) {
    return data[0]
  }
  return {}
}

module.exports = {
  formatId,
  generateRandomNum,
  generateData,
  generateMovieComments,
  generateShortComments,
  getList,
  searchById,
};
