(function () {
    ko.options.deferUpdates = true;
    var regex = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/;

    var model = {
        outbase: location.protocol + "//" + location.host + "/?url=",
        inurl: ko.observable('https://www.google.com')
    };
    model.urlvalid = ko.pureComputed(function () {
        return regex.test(model.inurl());
    });
    model.outencoded = ko.pureComputed(function () {
        return encodeURIComponent(model.inurl());
    });
    model.outfull = ko.pureComputed(function () {
        return model.outbase + model.outencoded();
    });

    ko.applyBindings(model);
})();