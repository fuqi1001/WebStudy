(function ($, location) {
    var exampleModal = $("#exampleModal");
    exampleModal.on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var mTitle = button.data('title')
        var mImg = button.data('img')
        var mText = button.data('text')
        var modal = $(this)
        modal.find('.modal-title').text(mTitle)
        modal.find('.modal-img').prop('src', 'public/img/' + mImg)
        modal.find('.modal-img').prop('alt', mTitle)
        modal.find('.modal-text').text(mText)
        modal.find('.modal-body input').val(mTitle)
    })
})(window.jQuery, window.location)