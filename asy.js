// eslint-disable-next-line node/no-extraneous-require, import/no-extraneous-dependencies
const superagent = require('superagent');

const getImage = async () => {
  try {
    const res = await superagent.get('https://dog.ceo/api/breeds/image/random');
    console.log(res.body.message);
  } catch (err) {
    console.log(err);
    throw err;
  }
  return '2: Ready';
};
(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getImage();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log('erorr bro');
  }
})();
