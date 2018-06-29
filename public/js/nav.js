/*  global document:true */
/*  eslint no-undef: "error"  */
/* eslint no-unused-vars: 0 */

const resNav = () => {
  const res = document.getElementById('top-nav');
  if (res.className === 'nav-bar') {
    res.className += ' responsive';
  } else {
    res.className = 'nav-bar';
  }
};
