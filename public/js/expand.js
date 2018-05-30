/*  global  document:true, */
/*  eslint no-undef: "error"  */
const expandBtn = () => {
  const coll = document.getElementsByClassName('btn');
  let i;

  for (i = 0; i < coll.length; i += 1) {
    coll[i].addEventListener('click', () => {
      this.classList.toggle('active');
      const expand = this.nextElementSibling;
      if (expand.style.maxHeight) {
        expand.style.maxHeight = null;
      } else {
        expand.style.maxHeight = `${expand.scrollHeight}px`;
      }
    });
  }
};
expandBtn();
