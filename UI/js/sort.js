const sortRequest = (evt, sortItems) => {
  let i, sortContent, sortLinks;
  sortContent = document.getElementsByClassName("sort-content");
  for (i = 0; i < sortContent.length; i++) {
      sortContent[i].style.display = "none";
  }
  sortLinks = document.getElementsByClassName("sortlinks");
  for (i = 0; i < sortLinks.length; i++) {
      sortLinks[i].className = sortLinks[i].className.replace(" active", "");
  }
  document.getElementById(sortItems).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();