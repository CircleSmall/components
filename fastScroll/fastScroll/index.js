import FastScroll from './fastScroll';
import $ from 'jquery';


function makeItems() {
    let items = [];
    let num = 50;
    while (num--) {
        let li = `<li class="li" style="width: 100%;">${num}</li>`;
        let i = 10;
        while (i--) {
            li += `<li class="li">${num}:${i}</li>`;
        }
        items.push({
            template: function () {
                return $(`<ul style="width: 50px;">${li}</ul>`);
            },
            getWidth: function () {
                return 50;
            }
        })
    }
    return items;
};

window.xx = new FastScroll({
    container: document.getElementById('container'),
    items: makeItems(),
    visualArea: {
        width: 200,
        height: 100
    }
});
