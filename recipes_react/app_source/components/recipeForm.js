const RecipeForm = (
    {
        title,
        description,
        steps,
        ingredients,
        newIngredient,
        newStep,
        formError,
        changeTitle,
        changeDescription,
        addIngredient,
        addStep,
        changeNewIngredientText,
        changeNewStepText,
        handleRecipeSubmission
    }) => {
    let visibleFormError = formError ? <div className="alert alert-danger">{formError}</div> : undefined;
    let newTitleText = `new Recipe: ${title || ''}(${ingredients.length} ingredients, ${step.length} steps)`;

    return <div className="recipe">
        <h3>Add a new Recipe</h3>
        {visibleFormError}
        <div className="form-horizontal">

            <div className="form-group">
                <label htmlFor="newTitle" className="col-sm-3 control-label">Title</label>
                <div className="col-sm-9">
                    <input
                        className="form-control"
                        id="newTitle"
                        placeholder="New Recipe"
                        onChange={(e) => {
                            changeTitle(e.target.value);
                        }}
                        value={title}
                        type="text"
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="newDescription" className="col-sm-3 control-label">Description</label>
                <div className="col-sm-9">
                    <textarea
                        className="form-control"
                        id="newDescription"
                        placeholder="Recipe description"
                        value={descruption}
                        onChange={(e) => {
                            changeDescription(e.target.value);
                        }}>
                    </textarea>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="newIngredientText" className="col-sm-3 control-label">New Ingredient</label>
                <div className="col-sm-9">
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="text"
                            id="newIngredientText"
                            placeholder="New Ingredient"
                            value={newIngredient}
                            onChange={(e) => {
                                changeNewIngredientText(e.target.value);
                            }}
                        />
                        <span className="input-group-btn">
                            <button className="btn btn-primary" type="button" onClick={
                                (e) => {
                                    addIngredient(e.target.value);
                                }
                            }>Add Ingredient</button>
                        </span>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="newStepText" className="col-sm-3 control-label">New Step</label>
                <div className="col-sm-9">
                    <textarea
                        className="form-control"
                        type="text"
                        id="newStep"
                        placeholder="New Step Instructions"
                        value={newStep}
                        onChange={(e) => {
                            changeNewStepText(e.target.value);
                        }}
                    >
                    </textarea>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" type="button" onClick={(e) => {
                        addStep(e.target.value);
                    }}>Add Step</button>
                </div>
            </div>

            <div className="form-group">
                <div className="col-sm-12">
                    <button type="submit" className="btn btn-default" onClick={(e) => {
                        handleRecipeSubmission(e.target.value);
                    }}>Add Recipe</button>
                </div>
            </div>
        </div>

        <Recipe
            title={newTitleText}
            description={description}
            steps={steps}
            ingredients={ingredients}
        />
    </div>

}