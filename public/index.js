(function () {
    ko.options.deferUpdates = true;
    var url_regex = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/,
        model = {
            inurl: ko.observable('https://www.google.com')
        };

    model.urlvalid = ko.pureComputed(function () {
        return url_regex.test(model.inurl());
    });
    model.outencoded = ko.pureComputed(function () {
        return encodeURIComponent(model.inurl());
    });
    model.outfull = ko.pureComputed(function () {
        return location.protocol + "//" + location.host + "/?url=" + model.outencoded();
    });

    ko.applyBindings(model);

    document.getElementById("out").addEventListener('click', function () {
        this.select();
    });
})();