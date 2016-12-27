let data = {};
let names = ['circle', 'zhihao', 'gary', 'inkie', 'percy', 'cohlint', 'liwen'];
let booksNum = 5;
let chaptersNum = 6;

for (let i in names) {
    let userObj = data[names[i]] = {};
    for (let j = 0; j < booksNum; j++) {
        let bookObj = userObj[`${names[i]} book ${j}`] = [];
        for (let k = 0; k < chaptersNum; k++) {
            bookObj.push(`chapter ${k}`);
        }
    }
}
console.log(data)

let current = {
    user: '',
    book: ''
};


let test = false;
const guide = {
    getData: (inputUtilObj) => {
        return new Promise(function (resolve, reject) {
            let list = [];
            if (test) {

                list = [{
                    origin: 'ee',
                    replace: 'eA'
                }, {
                    origin: 'ff',
                    replace: 'fB'
                }, {
                    origin: 'scc',
                    replace: 'sCC'
                }, {
                    origin: 'd22d',
                    replace: 'D4D'
                }]
                test = !test;
            } else {
                list = [{
                    origin: 'aa',
                    replace: 'AA'
                }, {
                    origin: 'bb',
                    replace: 'BB'
                }, {
                    origin: 'cc',
                    replace: 'CC'
                }, {
                    origin: 'dd',
                    replace: 'DD'
                }]

                test = !test;

            }
            resolve(list)
        })
    },
    mark: 'guides',
    suggestPosition: '',
    renderAfter: {
        addStrAtStart: () => '',
        addStrAtEnd: () => ''
    },
    renderBefore: {
        addStrAtStart: () => ''
    },
    renderReplaceValue: true,
    // jumpCurrent: true
};

const users = {
    getData: (inputUtilObj) => {
        return new Promise(function (resolve, reject) {
            let list = [];
            for (let i in data) {
                if (inputUtilObj.isComplete) {
                    list.push(i);
                } else if (i.indexOf(inputUtilObj.inputStr) > -1) {
                    list.push(i);
                }
            }
            resolve(list)
        })
    },
    mark: 'users',
    suggestPosition: 'auto',

    renderAfter: {
        addStrAtStart: () => 'us: ',
        addStrAtEnd: () => ' >'
    },
    renderBefore: {
        addStrAtStart: () => 'users: '
    },
    mutiple: true
};

const books = {
    getData: (inputUtilObj = {}) => {
        return new Promise(function (resolve, reject) {
            if (current.user) {
                let list = [];
                for (let i in data[current.user]) {
                    if (inputUtilObj.isComplete) {
                        list.push(i);
                    } else if (i.indexOf(inputUtilObj.inputStr) > -1) {
                        list.push(i);
                    }
                }
                resolve(list)
            }
        })
    },
    mark: 'books',
    suggestPosition: 'auto',
    renderAfter: {
        addStrAtStart: () => 'bks: ',
        addStrAtEnd: () => ' >'
    },
    renderBefore: {
        addStrAtStart: () => 'books: '
    }
};

const chapters = {
    getData: () => {
        return new Promise(function (resolve, reject) {
            console.log(current)
            if (current.user && current.book) {
                let obj = data[current.user][current.book];
                let list = [];
                for (let i in obj) {
                    list.push(obj[i]);
                }
                resolve(list)
            }
        })
    },
    mark: 'chapters',
    suggestPosition: 'auto'
};

const list = [guide, users, books, chapters];

const oneDataTest = users;

export default {current, list, oneDataTest}
