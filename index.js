const cardsContainer = document.querySelector(".cards .container");
const searchBar = document.querySelector(".container .search");
window.addEventListener("load", (event) => {
  fetch("../static-job-listings-master/data.json")
    .then((response) => response.json())
    .then((data) =>
      data.forEach((element) => {
        cardsContainer.innerHTML += getCardHtml(element);
      })
    )
    .catch((err) => console.log(err));
});

function getTagsHTML(tags) {
  return `<li class="qualification" dataset-tag = "${tags}">${tags}</li>`;
}
function getTagNew(newTag) {
  if (newTag === true) {
    return `<li class="new">New</li>`;
  } else {
    return "";
  }
}
function getTagfeatured(featTag) {
  if (featTag === true) {
    return `<li class="featured">Freatured</li>`;
  } else {
    return "";
  }
}

function getCardHtml(element) {
  let tags = "###Tags###";
  let newTag = "###New###";
  let featuredTag = "###featured###";

  let jobListingHtml = ` <div class="card">
<div>
<img src="${element.logo}"  alt="">
<div class="details">
  <ul>
    <li class="company-name" >${element.company}</li>
    ${newTag}
    ${featuredTag}
  </ul>

  <h3>${element.position}</h3>
  <p>${element.postedAt}<span></span> ${element.contract}<span></span> ${element.location}</p>
</div>
</div>
<ul class="qualification-list">

${tags}
</ul>
</div>`;
  const newTagArray = getTagNew(element.new);
  const featTagArray = getTagfeatured(element.featured);
  // Get Tags for level role ...
  const tagsArray = [
    element.role,
    element.level,
    ...(element.languages || []),
    ...(element.tools || []),
  ];

  const tagsstring = tagsArray.reduce((acc, curent) => {
    return acc + getTagsHTML(curent);
  }, "");
  return jobListingHtml
    .replace(newTag, newTagArray)
    .replace(tags, tagsstring)
    .replace(featuredTag, featTagArray);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("qualification")) {
    searchTag(e.target.textContent);
  }
});

function searchTag(tag) {
  let searchText = Array.from(searchBar.textContent.split(" "));
  if (searchBar.childElementCount === 0) {
    searchBar.style.opacity = "1";
    searchBar.innerHTML = `<span class="search-tag">${tag} </span>`;
    filterCards(tag);
  } else if (searchBar.childElementCount > 0) {
    if (searchText.indexOf(tag) != 0) {
      searchBar.innerHTML += `<span class="search-tag">${tag} </span>`;
      filterCards(tag);
    }
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("search-tag")) {
    e.target.remove();
    let tag = Array.from(document.querySelectorAll(".search-tag")).map((n) =>
      n.textContent.trim()
    );
    
    
    if(!tag.length){
      filterCards(tag)
    }else{
      tag.forEach((t) => filterCards(t));
    }
  }
});
function filterCards(tag) {
  let cards = Array.from(document.querySelectorAll(".card"));
  let empty = {};
  cards.forEach((card, index) => {
    let li = Array.from(card.children[1].children).map((n) => n.textContent);

    empty[index] = {
      card: card,
      li: li,
    };
  });

  for (i = 0; i <= Object.keys(empty).length; i++) {
    let arr = empty[i].li;

    //If dosen't match
    var x = arr.indexOf(tag);

    if (arr.indexOf(tag) === -1) {
      empty[i].card.classList.add("inactive");
    }
    // If it matchs
    else if (arr.indexOf(tag) === 0) {
      empty[i].card.classList.remove("inactive");
    }
    if(!tag.length){
      empty[i].card.classList.remove("inactive");
    }
  }
}

