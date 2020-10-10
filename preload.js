utools.onPluginReady(() => {
  utools.setSubInput(({text}) => {
    console.log(text);
  }, 'package name');
});

window.exports = {
  'npm': {
    mode: 'list',
    placeholder: '回车'
  }
}