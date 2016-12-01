import testData from './getData';
import Suggest from './suggest';

let suggest = new Suggest($('.demo1'), testData.list);

$(suggest).on('markChange', function (e,mark) {
    if (mark.markName === 'users') {
        testData.current.user = mark.value;
        testData.current.book = '';
    } else if (mark.markName === 'books') {
        testData.current.book = mark.value;
    }
});


let suggest2 = new Suggest($('.demo2'), testData.oneDataTest);
$(suggest2).on('markChange', function (e,mark) {
});
