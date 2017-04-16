const CommentForm = (
    {
        comment,
        onCommentChange,
        onCommentSubmit,
        commenterName,
        onCommenterNameChange,
        formError
    }) => {
    let visibleFormError = formError ? <div className="alert alert-danger">{formError}</div> : undefined;
    return <form
        onSubmit={(e) => {
            e.preventDefault();
            onCommentSubmit(comment, commenterName);
        }}>
        <div className="form-group">
            <label htmlFor="newComment" className="input-control">Comment</label>
            <input
                id="newComment"
                type="text"
                value={comment}
                onChange={(e) => {
                    onCommentChange(e.target.value);
                }}
                className="form-control" />
        </div>
        <div className="form-group">
            <label htmlFor="newName" className="input-control">Your name</label>
            <input
                id="newName"
                type="text"
                value={commenterName}
                onChange={(e) => {
                    onCommenterNameChange(e.target.value);
                }}
                className="form-control"
            />
        </div>
        <div className="form-group">
            <button type="submit" className="btn btn-primary">Submit</button>
        </div>
        {visibleFormError}
    </form>
};