const resNav = () => {
  const res = document.getElementById("top-nav");
  if (res.className === "nav-bar") {
      res.className += " responsive";
  } else {
      res.className = "nav-bar";
  }
}