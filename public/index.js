(function () {
    ko.options.deferUpdates = true;
    var url_regex = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/,
        uptime_nf = ko.observable(null),
        model = {
            inurl: ko.observable('https://www.google.com'),
            uptime: ko.pureComputed(function () {
                var nf = uptime_nf();
                if (nf) {
                    return parseMs.toWords(parseFloat(nf.substr(0, nf.length - 1)) * 1000);
                }
                return 'waiting...';
            }),
            mem: ko.observable('waiting...')
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

    function systemStatsCallback() {
        if (this.readyState === 4) {
            var rsp = JSON.parse(this.response),
                i = 0,
                target;

            for (; i < rsp.length; i++) {
                target = rsp[i].name === 'Uptime' ? uptime_nf : model.mem;
                target(rsp[i].value);
            }
        }
    }

    function querySystemStats() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", systemStatsCallback);
        xhr.open("GET", "/info/poll");
        xhr.send();
    }

    querySystemStats();
    setInterval(querySystemStats, 5000);

    document.getElementById("out").addEventListener('click', function () {
        this.select();
    });
})();