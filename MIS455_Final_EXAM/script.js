const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");


searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});


function getMealList() {
    let searchValue = searchInput.value.trim();
    
    
    mealList.innerHTML = "";
    
    if (!searchValue) {
        mealList.innerHTML = "Please enter a meal ingredient to search.";
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchValue}`)
        .then((response) => response.json())
        .then((data) => {
            let html = "";
            if (data.meals) {
                const mealsToShow = data.meals.slice(0, 5); 
                mealsToShow.forEach((meal) => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="meal image">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <button class="recipe-btn">Get Recipe</button>
                            </div>
                        </div>
                    `;
                });

                if (data.meals.length > 5) {
                    html += `<button id="show-more" class="btn">SHOW MORE</button>`;
                }

                mealList.classList.remove("notFound");
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add("notFound");
            }
            mealList.innerHTML = html;

          
            const showMoreBtn = document.getElementById("show-more");
            if (showMoreBtn) {
                showMoreBtn.addEventListener("click", () => showMoreMeals(data.meals));
            }
        });
}


function showMoreMeals(allMeals) {
    let html = "";
    allMeals.slice(5).forEach((meal) => { 
        html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="meal image">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <button class="recipe-btn">Get Recipe</button>
                </div>
            </div>
        `;
    });

   
    html += `<button id="show-less" class="btn">SHOW LESS</button>`;
    mealList.innerHTML += html;

   
    const showLessBtn = document.getElementById("show-less");
    if (showLessBtn) {
        showLessBtn.addEventListener("click", () => showLessMeals());
    }

   
    const showMoreBtn = document.getElementById("show-more");
    if (showMoreBtn) {
        showMoreBtn.style.display = "none";
    }
}


function showLessMeals() {
    const allMeals = mealList.querySelectorAll(".meal-item");
    const showMoreBtn = document.getElementById("show-more");
    const showLessBtn = document.getElementById("show-less");

  
    allMeals.forEach((meal, index) => {
        if (index >= 5) {
            meal.style.display = "none";
        }
    });

    
    showMoreBtn.style.display = "block";
    showLessBtn.style.display = "none";
}


function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then((response) => response.json())
            .then((data) => mealRecipeModal(data.meals[0]));
    }
}


function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="meal image">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <p><strong>Meal ID:</strong> ${meal.idMeal}</p>
        <p><strong>Meal Title:</strong> ${meal.strMeal}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}
