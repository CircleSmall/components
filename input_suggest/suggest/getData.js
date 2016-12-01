let data = {};
let names = ['circle', 'zhihao', 'gary', 'inkie', 'percy', 'cohlint', 'liwen'];
let booksNum = 5;
let chaptersNum = 6;

for (let i in names) {
    let userObj = data[names[i]] = {};
    for (let j = 0; j < booksNum; j++) {
        let bookObj = userObj[`${names[i]}_book_${j}`] = [];
        for (let k = 0; k < chaptersNum; k++) {
            bookObj.push(`chapter_${k}`);
        }
    }
}
console.log(data)

let current = {
    user: '',
    book: ''
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
    after: () => ' >',
    before: () => 'users: ',
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
    after: () => ' >',
    before: () => 'books: '
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
    suggestPosition: 'auto',
    after: () => ' >',
    before: () => 'chapters: '
};

const list = [users, books, chapters];

const oneDataTest = users;

export default {current, list, oneDataTest}
