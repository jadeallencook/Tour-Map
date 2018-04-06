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
        }
    }

    var details = {
        current: 0,
        show: function (num) {
            num = parseInt(num);
            details.current = num;
            var location = tour[num];
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
                var text = location.bullets[x];
                var bullet = document.createElement('li');
                bullet.innerText = text;
                list.appendChild(bullet);
            }
            document.querySelector('div.map-tour-container').onscroll = function (e) {
                var scroll = 0 - e.target.scrollTop;
                document.getElementById('page-changer').style.bottom = scroll + 'px';
            }
            document.getElementById('next').onclick = function () {
                if (details.current < tour.length - 1) details.current++;
                else details.current = 0;
                details.show(details.current);
            }
            document.getElementById('last').onclick = function () {
                if (details.current === 0) details.current = tour.length - 1;
                else details.current--;
                details.show(details.current);
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
    }).catch(function () {
        console.log('error');
    });
})();