/*  global document:true */
/*  eslint no-undef: "error"  */
/* eslint no-unused-vars: 0 */

const mySort = () => {
  const getValue = document.getElementById('mySelect').value;
  if (getValue === 'all') {
    document.getElementById('all').style.display = 'block';
    document.getElementById('pending').style.display = 'none';
    document.getElementById('approved').style.display = 'none';
    document.getElementById('rejected').style.display = 'none';
    document.getElementById('resolved').style.display = 'none';
  }
  if (getValue === 'pending') {
    document.getElementById('all').style.display = 'none';
    document.getElementById('pending').style.display = 'block';
    document.getElementById('approved').style.display = 'none';
    document.getElementById('rejected').style.display = 'none';
    document.getElementById('resolved').style.display = 'none';
  }
  if (getValue === 'approved') {
    document.getElementById('all').style.display = 'none';
    document.getElementById('pending').style.display = 'none';
    document.getElementById('approved').style.display = 'block';
    document.getElementById('rejected').style.display = 'none';
    document.getElementById('resolved').style.display = 'none';
  }
  if (getValue === 'rejected') {
    document.getElementById('all').style.display = 'none';
    document.getElementById('pending').style.display = 'none';
    document.getElementById('approved').style.display = 'none';
    document.getElementById('rejected').style.display = 'block';
    document.getElementById('resolved').style.display = 'none';
  }
  if (getValue === 'resolved') {
    document.getElementById('all').style.display = 'none';
    document.getElementById('pending').style.display = 'none';
    document.getElementById('approved').style.display = 'none';
    document.getElementById('rejected').style.display = 'none';
    document.getElementById('resolved').style.display = 'block';
  }
};
document.getElementById('mySelect').addEventListener('change', mySort);
