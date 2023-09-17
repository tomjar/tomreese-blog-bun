var Utility = {
    showToastrMessage: function (type, message) {
        return toastr[type](message);
    }
};