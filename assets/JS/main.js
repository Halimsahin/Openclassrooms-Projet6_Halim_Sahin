///// Variables /////

let galleryImages;
let categorieChoice;

const portfolio = document.getElementById("portfolio");
const gallery = document.querySelector(".gallery");
const trashPhoto = document.querySelector(".photo");
const modale = document.getElementById("modale");
const modify = document.querySelector(".btn-modifier");
const cross = document.querySelector(".cross");
const divTrash = document.querySelector(".trash");
const divAdd = document.querySelector(".add");
const arrow = document.querySelector(".arrow");
const btnAdd = document.querySelector(".btn-add");
const btnElement = document.querySelector(".btn-filter");
const btnTous = document.createElement("a");
const logOut = document.querySelector(".log-out");
const btnValue = document.querySelector(".btn-value");
const imageInput = document.getElementById("image-input");
const titleInput = document.getElementById("title");
const selectInput = document.getElementById("select");
const backgroundGrey = document.querySelector(".background-grey");
btnTous.innerText = "Tous";

////// Evenements //////

btnTous.addEventListener("click", () => {
  displayImages(galleryImages);
  console.log(galleryImages);
});
btnElement.appendChild(btnTous);

modify.addEventListener("click", () => {
  modale.style.display = "block";
  backgroundGrey.style.display = "block";
});

cross.addEventListener("click", () => {
  modale.style.display = "none";
  backgroundGrey.style.display = "none";
});

btnAdd.addEventListener("click", () => {
  divTrash.style.display = "none";
  divAdd.style.display = "block";
});

arrow.addEventListener("click", () => {
  divAdd.style.display = "none";
  divTrash.style.display = "block";
});

logOut.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  // e.preventDefault();
});

btnValue.addEventListener("click", (e) => {
  if (imageInput.value === "" || titleInput.value === "" || selectInput.value === "") {
    alert("Veuillez remplir tous les champs");
  } else {
    modale.style.display = "none";
    backgroundGrey.style.display = "none";
    addImage();
  }
});

backgroundGrey.addEventListener("click", () => {
  modale.style.display = "none";
  backgroundGrey.style.display = "none";
});

imageInput && titleInput && selectInput.addEventListener("change", changeColorBtn);

///// Functions /////

function modaleCategories() {
  const select = document.getElementById("select");
  categorieChoice.forEach((e) => {
    const option = document.createElement("option");
    option.setAttribute("id", e.id);
    option.innerText = e.name;
    select.appendChild(option);
  });
}
async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories");
  const categoriesJson = await categories.json();
  categorieChoice = categoriesJson;
  displayCategories(categoriesJson);
  modaleCategories();
}
function displayCategories(buttons) {
  for (const button of buttons) {
    const btn = document.createElement("a");
    btn.innerText = button.name;
    btn.addEventListener("click", () => {
      filterCategories(button.id);
    });
    btnElement.appendChild(btn);
  }
}
function filterCategories(categorieId) {
  const result = galleryImages.filter(
    (image) => image.categoryId === categorieId
  );
  displayImages(result);
  console.log(result);
  console.log(categorieId);
  console.log(galleryImages);
}

async function getImage() {
  const works = await fetch("http://localhost:5678/api/works");
  const worksJson = await works.json();
  galleryImages = worksJson;
  displayImages(worksJson);
  trashImages(worksJson);
}

function displayImages(images) {
  gallery.innerHTML = "";
  for (const image of images) {
    const figure = document.createElement("figure");
    const imgElement = document.createElement("img");
    const desc = document.createElement("figcaption");
    imgElement.src = image.imageUrl;
    desc.innerText = image.title;
    figure.appendChild(imgElement);
    figure.appendChild(desc);
    gallery.appendChild(figure);
  }
}

function checkLogin() {
  const token = localStorage.getItem("token");
  if (token) {
    btnElement.style.display = "none";
    const btnModify = document.createElement("a");
    modifyBis = modify;
    const iModify = document.createElement("i");
    const logOut = document.querySelector(".log-out");
    const editionMode = document.querySelector(".mode-edition");
    const header = document.querySelector("header");

    modify.appendChild(iModify);
    modify.appendChild(btnModify);

    iModify.classList.add("fa-solid");
    iModify.classList.add("fa-pen-to-square");

    btnModify.innerText = "modifier";
    logOut.innerText = "logout";

    editionMode.style.display = "flex";
    header.style.margin = "100px 0 0 0";
  }
}

function trashImages(images) {
  trashPhoto.innerHTML = "";
  for (const image of images) {
    const figure = document.createElement("figure");
    const imgElement = document.createElement("img");
    const icons = document.createElement("i");
    icons.classList.add("fa-solid", "fa-trash-can");
    icons.addEventListener("click", () => {
      deleteImage(image.id);
    });
    icons.setAttribute("id", image.id);
    figure.appendChild(icons);
    imgElement.src = image.imageUrl;
    figure.appendChild(imgElement);
    trashPhoto.appendChild(figure);
  }
}

async function deleteImage(id) {
  const token = localStorage.getItem("token");
  try {
    await fetch("http://localhost:5678/api/works/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    getImage();
  } catch (e) {
    console.log(e);
  }
}
const formData = new FormData();

async function addImage() {
  const token = localStorage.getItem("token");
  const fileDoc = document.getElementById("image-input").files[0];
  const choiceTitle = document.getElementById("title").value;
  const choiceCategorie = document.getElementById("select");
  const formData = new FormData();
  formData.append("title", choiceTitle);
  formData.append("category", parseInt(choiceCategorie.options[choiceCategorie.selectedIndex].id));
  formData.append("image", fileDoc);
  console.log(choiceCategorie.options[choiceCategorie.selectedIndex].id);
  try {
    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    getImage();
  } catch (e) {
    console.log(e);
  }
}

function previewImage(e) {
  const input = e.target;
  const image = document.querySelector(".prev-img");

  console.log(input.files);

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
const previewFile = document.getElementById("image-input");
previewFile.addEventListener("change", (e) => {
  previewImage(e);
  const iconeAdd = document.querySelector(".icone-add");
  const pAdd = document.querySelector(".p-add");
  const labelAdd = document.querySelector(".label-add");
  const image = document.querySelector(".prev-img");
  iconeAdd.style.display = "none";
  pAdd.style.display = "none";
  labelAdd.style.display = "none";
  image.style.display = "block";
});

function changeColorBtn() {
  if (imageInput.value === "" || titleInput.value === "" || selectInput.value === "") {
  } else {
    btnValue.style.background = "#1D6154";
    btnValue.style.border = `#1D6154`;
  }
};

checkLogin();
getImage();
getCategories();

