(function () {
    var tour = null;

    var loading = {
        hide: function () {
            document.getElementById('loading').style.display = 'none';
        }
    }

    var menu = {
        load: function () {
            var locations = document.getElementById('locations-container');
            locations.innerHTML = null;
            for (var x = 0; x < tour.length; x++) {
                var elem = document.createElement('div');
                elem.classList.add('location-label');
                elem.innerText = tour[x].city;
                if (tour[x].state_abv.length > 0) elem.innerText += ', ' + tour[x].state_abv;
                elem.setAttribute('data-num', x);
                elem.onclick = function () {
                    details.show(this.getAttribute('data-num'));
                }
                locations.appendChild(elem);
            }
        },
        show: function () {
            document.getElementById('menu').style.display = 'block';
        },
        hide: function () {
            document.getElementById('menu').style.display = 'none';
        },
        map: function () {
            var areas = document.querySelectorAll('map area');
            for (var x = 0; x < areas.length; x++) {
                var area = areas[x];
                area.onclick = function () {
                    var num = parseInt(this.getAttribute('data-num'));
                    details.show(num);
                }
            }
        }
    }

    var details = {
        current: 0,
        show: function (num) {
            num = parseInt(num);
            details.current = num;
            var location = tour[num];
            document.getElementById('location').scrollTop = 0;
            document.getElementById('close').onclick = function () {
                details.hide();
                menu.show();
            }
            document.getElementById('single-state').setAttribute('src', location.state_img);
            document.getElementById('state-label').innerText = location.city;
            if (location.state_full.length > 0) document.getElementById('state-label').innerText += ', ' + location.state_full;
            document.getElementById('date-label').innerText = location.date;
            document.getElementById('location-description').innerText = location.description;
            var list = document.getElementById('location-bullets');
            list.innerHTML = null;
            for (var x = 0; x < location.bullets.length; x++) {
                var text = location.bullets[x].text;
                var bullet = document.createElement('li');
                var href = location.bullets[x].link;
                if (href) {
                    var link = document.createElement('a');
                    link.setAttribute('href', href);
                    link.setAttribute('target', '_blank');
                    link.innerText = text;
                    bullet.appendChild(link);
                } else {
                    bullet.innerHTML = text;
                }
                list.appendChild(bullet);
            }
            document.querySelector('div#location').onscroll = function (e) {
                var scroll = 0 - e.target.scrollTop;
                document.getElementById('page-changer').style.bottom = scroll + 'px';
            }
            document.getElementById('next').onclick = function () {
                if (details.current < tour.length - 1) {
                    details.current++;
                    details.show(details.current);
                } else {
                    details.hide();
                    menu.show();
                }
            }
            document.getElementById('last').onclick = function () {
                if (details.current === 0) {
                    details.hide();
                    menu.show();
                } else {
                    details.current--;
                    details.show(details.current);
                }
            }
            menu.hide();
            document.getElementById('location').style.display = 'block';
        },
        hide: function () {
            document.getElementById('location').style.display = 'none';
        }
    }

    new Promise(function (res, rej) {
        var request = new XMLHttpRequest();
        request.onload = function (e) {
            tour = JSON.parse(e.target.response);
            if (tour) res();
            else rej();
        }
        request.open('get', 'tour.json');
        request.send();
    }).then(function () {
        menu.load();
        loading.hide();
        menu.show();
        menu.map();
    }).catch(function () {
        console.log('error');
    });
})();