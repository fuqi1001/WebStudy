"use strict";

var AppComponent = function AppComponent() {
    return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "div",
            { className: "col-sm-8" },
            React.createElement(RecipeContainer, { url: "/recipes" })
        ),
        React.createElement(
            "div",
            { className: "col-sm-4" },
            React.createElement(CommentContainer, null)
        )
    );
};
"use strict";

var CommentContainer = React.createClass({
    displayName: "CommentContainer",
    getInitialState: function getInitialState() {
        return {
            comments: [],
            newComment: "",
            commenterName: "",
            error: ""
        };
    },
    loadComments: function loadComments() {
        return $.get("/comments");
    },
    addComment: function addComment(commenter, comment) {
        return $.ajax({
            url: "/comments",
            dataType: "json",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                comment: {
                    commenter: commenter, comment: comment
                }
            })
        });
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.loadComments().then(function (commentList) {
            _this.setState({ comments: commentList });
        });
    },
    handleCommentChange: function handleCommentChange(newText) {
        this.setState({ newComment: newText });
    },
    handleCommentSubmission: function handleCommentSubmission(newComment, newCommenterName) {
        var _this2 = this;

        if (!newComment) {
            this.setState({ error: "No comment provided" });
            return;
        };
        if (!newCommenterName) {
            this.setState({ errror: "No comment name provided" });
            return;
        }

        var commentList = this.state.comments;
        var currentlyMatchingComment = commentList.filter(function (commentData) {
            return commentData.comment === newComment && commentData.commenter === newCommenterName;
        });

        if (currentlyMatchingComment.length > 0) {
            this.setState({ errpr: "No spamming allowed" });
            return;
        }

        this.setState({ error: "" });
        this.setState({
            newComment: ""
        });

        this.addComment(newCommenterName, newComment).then(function (newCommentObject) {
            _this2.setState({
                comments: _this2.state.comments.concat(newCommentObject)
            });
        }, function (error) {
            _this2.setState({ error: JSON.stringify(error) });
        });
    },
    handleCommentNameChange: function handleCommentNameChange(newCommenterName) {
        if (!newCommenterName) return;

        this.setState({
            commenterName: newCommenterName
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(CommentList, { comments: this.state.comments }),
            React.createElement(CommentForm, {
                commenterName: this.state.commenterName,
                comment: this.state.newComment,
                onCommentChange: this.handleCommentChange,
                onCommentSubmit: this.handleCommentSubmission,
                onCommenterNameChange: this.handleCommentNameChange,
                formError: this.state.error
            })
        );
    }
});
"use strict";

var RecipeContainer = React.createClass({
    displayName: "RecipeContainer",

    getInitialState: function getInitialState() {
        return {
            recipes: [],
            title: "",
            description: "",
            steps: [],
            ingredients: [],
            newIngredient: "",
            newStep: "",
            error: ""
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        console.log("run mount");
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function success(recipeList) {
                _this.setState({ recipes: recipeList });
            },
            error: function error(xhr, status, err) {
                console.error(_this.props.url, status, err.toString());
            }
        });
    },
    changeTitle: function changeTitle(e) {
        this.setState({ title: e });
    },
    changeDescription: function changeDescription(e) {
        this.setState({ description: e });
    },
    addIngredient: function addIngredient(e) {
        if (!this.state.newIngredient) return;
        var ingredients = this.state.ingredients.concat([this.state.newIngredient]);
        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    addStep: function addStep(e) {
        if (!this.state.newStep) return;
        var steps = this.state.steps.concat([this.state.newStep]);
        this.setState({ steps: steps, newStep: "" });
    },
    changeNewIngredientText: function changeNewIngredientText(e) {
        this.setState({ newIngredient: e });
    },
    changeNewStepText: function changeNewStepText(e) {
        this.setState({ newStep: e });
    },
    handleRecipeSubmission: function handleRecipeSubmission(e) {
        var _this2 = this;

        if (!this.state.title) {
            this.setState({ error: "Error: Please add title." });
            return;
        }

        if (!this.state.description) {
            this.setState({ error: "Error: Please add description." });
            return;
        }

        if (this.state.ingredients.length == 0) {
            this.setState({ error: "Error: Please add ingredients." });
            return;
        }
        if (this.state.steps == 0) {
            this.setState({ error: "Error: Please add steps" });
            return;
        }
        var recipeList = this.state.recipes;
        var currentlyMatchingRecipe = recipeList.filter(function (recipeData) {
            return recipeData.title === _this2.state.title;
        });
        if (currentlyMatchingRecipe.length > 0) {
            this.setState({ error: "No spamming allowed" });
            return;
        }

        this.setState({ error: "" });

        this.addRecipe(this.state.title, this.state.description, this.state.ingredients, this.state.steps).then(function (newRecipeObject) {
            var recipes = _this2.state.recipes.concat([newRecipeObject]);
            _this2.setState({ recipes: recipes, title: "", description: "", steps: [], ingredients: [] });
        }, function (error) {
            _this2.setState({ error: JSON.stringify(error) });
        });
    },
    addRecipe: function addRecipe(title, description, ingredients, steps) {
        return $.ajax({
            url: "/recipes",
            dataType: "json",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                recipe: {
                    title: title, description: description, ingredients: ingredients, steps: steps
                }
            })
        });
    },


    render: function render() {
        return React.createElement(
            "div",
            { className: "recipe" },
            React.createElement(RecipeList, { recipes: this.state.recipes }),
            React.createElement("hr", null),
            React.createElement(RecipeForm, {
                title: this.state.title,
                description: this.state.description,
                steps: this.state.steps,
                ingredients: this.state.ingredients,
                newIngredient: this.state.newIngredient,
                newStep: this.state.newStep,
                formError: this.state.error,
                changeTitle: this.changeTitle,
                changeDescription: this.changeDescription,
                addIngredient: this.addIngredient,
                addStep: this.addStep,
                changeNewIngredientText: this.changeNewIngredientText,
                changeNewStepText: this.changeNewStepText,
                handleRecipeSubmission: this.handleRecipeSubmission
            })
        );
    }
});
"use strict";

var Recipe = function Recipe(_ref) {
    var steps = _ref.steps,
        title = _ref.title,
        description = _ref.description,
        ingredients = _ref.ingredients;

    var viewSteps = steps.map(function (step) {
        return React.createElement(
            "li",
            null,
            step
        );
    });
    var viewIngredients = ingredients.map(function (step) {
        return React.createElement(
            "li",
            null,
            step
        );
    });

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            title
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "p",
                    null,
                    description
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-md-8" },
                        React.createElement(
                            "ol",
                            null,
                            viewSteps
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-4" },
                        React.createElement(
                            "ul",
                            null,
                            viewIngredients
                        )
                    )
                )
            )
        )
    );
};
"use strict";

var RecipeForm = function RecipeForm(_ref) {
    var title = _ref.title,
        description = _ref.description,
        steps = _ref.steps,
        ingredients = _ref.ingredients,
        newIngredient = _ref.newIngredient,
        newStep = _ref.newStep,
        formError = _ref.formError,
        changeTitle = _ref.changeTitle,
        changeDescription = _ref.changeDescription,
        addIngredient = _ref.addIngredient,
        addStep = _ref.addStep,
        changeNewIngredientText = _ref.changeNewIngredientText,
        changeNewStepText = _ref.changeNewStepText,
        handleRecipeSubmission = _ref.handleRecipeSubmission;

    var visibleFormError = formError ? React.createElement(
        "div",
        { className: "alert alert-danger" },
        formError
    ) : undefined;
    var newTitleText = "new Recipe: " + (title || '') + "(" + ingredients.length + " ingredients, " + steps.length + " steps)";

    return React.createElement(
        "div",
        { className: "recipe" },
        React.createElement(
            "h3",
            null,
            "Add a new Recipe"
        ),
        visibleFormError,
        React.createElement(
            "div",
            { className: "form-horizontal" },
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "newTitle", className: "col-sm-3 control-label" },
                    "Title"
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-9" },
                    React.createElement("input", {
                        className: "form-control",
                        id: "newTitle",
                        placeholder: "New Recipe",
                        onChange: function onChange(e) {
                            changeTitle(e.target.value);
                        },
                        value: title,
                        type: "text"
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "newDescription", className: "col-sm-3 control-label" },
                    "Description"
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-9" },
                    React.createElement("textarea", {
                        className: "form-control",
                        id: "newDescription",
                        placeholder: "Recipe description",
                        value: description,
                        onChange: function onChange(e) {
                            changeDescription(e.target.value);
                        } })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "newIngredientText", className: "col-sm-3 control-label" },
                    "New Ingredient"
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-9" },
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input", {
                            className: "form-control",
                            type: "text",
                            id: "newIngredientText",
                            placeholder: "New Ingredient",
                            value: newIngredient,
                            onChange: function onChange(e) {
                                changeNewIngredientText(e.target.value);
                            }
                        }),
                        React.createElement(
                            "span",
                            { className: "input-group-btn" },
                            React.createElement(
                                "button",
                                { className: "btn btn-primary", type: "button", onClick: function onClick(e) {
                                        addIngredient(e.target.value);
                                    } },
                                "Add Ingredient"
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "newStepText", className: "col-sm-3 control-label" },
                    "New Step"
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-9" },
                    React.createElement("textarea", {
                        className: "form-control",
                        type: "text",
                        id: "newStep",
                        placeholder: "New Step Instructions",
                        value: newStep,
                        onChange: function onChange(e) {
                            changeNewStepText(e.target.value);
                        }
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "div",
                    { className: "col-sm-offset-3 col-sm-9" },
                    React.createElement(
                        "button",
                        { className: "btn btn-primary", type: "button", onClick: function onClick(e) {
                                addStep(e.target.value);
                            } },
                        "Add Step"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "div",
                    { className: "col-sm-12" },
                    React.createElement(
                        "button",
                        { type: "submit", className: "btn btn-default", onClick: function onClick(e) {
                                handleRecipeSubmission(e.target.value);
                            } },
                        "Add Recipe"
                    )
                )
            )
        ),
        React.createElement(Recipe, {
            title: newTitleText,
            description: description,
            steps: steps,
            ingredients: ingredients
        })
    );
};
"use strict";

var CommentForm = function CommentForm(_ref) {
    var comment = _ref.comment,
        onCommentChange = _ref.onCommentChange,
        onCommentSubmit = _ref.onCommentSubmit,
        commenterName = _ref.commenterName,
        onCommenterNameChange = _ref.onCommenterNameChange,
        formError = _ref.formError;

    var visibleFormError = formError ? React.createElement(
        "div",
        { className: "alert alert-danger" },
        formError
    ) : undefined;
    return React.createElement(
        "form",
        {
            onSubmit: function onSubmit(e) {
                e.preventDefault();
                onCommentSubmit(comment, commenterName);
            } },
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: "newComment", className: "input-control" },
                "Comment"
            ),
            React.createElement("input", {
                id: "newComment",
                type: "text",
                value: comment,
                onChange: function onChange(e) {
                    onCommentChange(e.target.value);
                },
                className: "form-control" })
        ),
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: "newName", className: "input-control" },
                "Your name"
            ),
            React.createElement("input", {
                id: "newName",
                type: "text",
                value: commenterName,
                onChange: function onChange(e) {
                    onCommenterNameChange(e.target.value);
                },
                className: "form-control"
            })
        ),
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "button",
                { type: "submit", className: "btn btn-primary" },
                "Submit"
            )
        ),
        visibleFormError
    );
};
"use strict";

var CommentList = function CommentList(_ref) {
    var comments = _ref.comments;

    return React.createElement(
        "ul",
        { className: "list-unstyled" },
        comments.map(function (commentData) {
            return React.createElement(
                "li",
                null,
                "[",
                commentData.commenter,
                "]: ",
                commentData.comment
            );
        })
    );
};
"use strict";

var RecipeList = function RecipeList(_ref) {
    var recipes = _ref.recipes;

    return React.createElement(
        "div",
        null,
        recipes.map(function (recipe) {
            return React.createElement(Recipe, {
                key: recipe.id,
                title: recipe.title,
                description: recipe.description,
                id: recipe.id,
                steps: recipe.steps,
                ingredients: recipe.ingredients
            });
        })
    );
};
'use strict';

ReactDOM.render(React.createElement(AppComponent, null), document.getElementById('content'));