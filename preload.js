const {shell} = require('electron');
const https = require('https');
utools.onPluginReady(() => {
  utools.setSubInput(({text}) => {
    console.log(text);
  }, 'package name');
});

const url = 'https://www.npmjs.com/search/suggestions?q=';
const errorMsg = {
  title: '无返回结果',
  description: '请更换关键词 or 回车跳转npm官网',
  url: 'https://www.npmjs.com'
}

let timer;

const getList = (keyWord) => {
  let urlP = url + keyWord;
  return new Promise((resolve, reject) => {
    https.get(urlP, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const parseData = JSON.parse(rawData);
          resolve(parseData);
        } catch (e) {
          reject(e.message);
        }
      })
    })
  });
};

const searchFn = (action, keyWord, callbackSetList) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    getList(keyWord).then(_data => {
      setList(_data, callbackSetList);
    })
  }, 500);
}

const setList = (list, callbackSetList) => {
  let target = [];
  if (list instanceof Array && list.length > 0) {
    list.forEach(_ => {
      target.push({
        title: _.name,
        description: _.description,
        url: _.links.npm
      })
    });
  } else {
    target.push(errorMsg);
  }
  callbackSetList(target);
}

window.exports = {
  'npm': {
    mode: 'list',
    placeholder: '回车',
    args: {
      enter: (actions, callbackSetList) => {
        callbackSetList([
          {
            title: '请输入包名',
          }
        ])
      },
      search: (action, keyWord, callbackSetList) => {
        searchFn(action, keyWord, callbackSetList);
      },
      select: (action, itemData, callbackSetList) => {
        const url = itemData.url;
        shell.openExternal(url);
      }
    }
  }
}