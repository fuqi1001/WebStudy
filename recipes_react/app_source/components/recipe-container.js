const RecipeContainer = React.createClass({
    getInitialState: function () {
        return {
            recipes: [],
            title: "",
            description: "",
            steps: [],
            ingredients: [],
            newIngredient: "",
            newStep: "",
            error: ""
        }
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (recipeList) => {
                this.setState({ recipes: recipeList });
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    changeTitle(e) {
        this.setState({ title: e });
    },
    changeDescription(e) {
        this.setState({ description: e });
    },
    addIngredient(e) {
        if (!this.state.newIngredient) return
        let ingredients = this.state.ingredients.concat([this.state.newIngredient]);
        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    addStep(e) {
        if (!this.state.newStep) return
        let steps = this.state.steps.concat([this.state.newStep]);
        this.setState({ steps: steps, newStep: "" })
    },
    changeNewIngredientText(e) {
        this.setState({ newIngredient: e });
    },
    changeNewStepText(e) {
        this.setState({ newStep: e });
    },
    handleRecipeSubmission(e) {
        if (!this.state.title) {
            this.setState({ error: "Error: Please add title." })
            return
        }

        if (!this.state.description) {
            this.setState({ error: "Error: Please add description." })
            return
        }

        if (this.state.ingredients.length == 0) {
            this.setState({ error: "Error: Please add ingredients." })
            return
        }
        if (this.state.steps == 0) {
            this.setState({ error: "Error: Please add steps" })
            return
        }
        let recipeList = this.state.recipes;
        let currentlyMatchingRecipe = recipeList.filter(recipeData => {
            return recipeData.title === this.state.title;
        });
        if (currentlyMatchingRecipe.length > 0) {
            this.setState({ error: "No spamming allowed" });
            return;
        }

        this.setState({ error: "" });

        this.addRecipe(this.state.title, this.state.description, this.state.ingredients, this.state.steps).then((newRecipeObject) => {
            let recipes = this.state.recipes.concat([newRecipeObject]);
            this.setState({ recipes: recipes, title: "", description: "", steps: [], ingredients: [] });
        }, (error) => {
            this.setState({ error: JSON.stringify(error) });
        });
    },

    addRecipe(title, description, ingredients, steps) {
        return $.ajax({
            url: "/recipes",
            dataType: "json",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                recipe: {
                    title, description, ingredients, steps
                }
            })
        });
    },

    render: function () {
        return (
            <div className="recipe">
                <RecipeList recipes={this.state.recipes} />
                <hr />
                <RecipeForm
                    title={this.state.title}
                    description={this.state.description}
                    steps={this.state.steps}
                    ingredients={this.state.ingredients}
                    newIngredient={this.state.newIngredient}
                    newStep={this.state.newStep}
                    formError={this.state.error}
                    changeTitle={this.changeTitle}
                    changeDescription={this.changeDescription}
                    addIngredient={this.addIngredient}
                    addStep={this.addStep}
                    changeNewIngredientText={this.changeNewIngredientText}
                    changeNewStepText={this.changeNewStepText}
                    handleRecipeSubmission={this.handleRecipeSubmission}
                />
            </div>
        );
    }
})