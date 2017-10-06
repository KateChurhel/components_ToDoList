;
(function() {
    'use strict';

    // import
    let List = window.List;
    let Form = window.Form;

    /**
     * Компонента "Программа"
     */
    class App {
        /**
         * @constructor
         * @param  {HTMLElement} el
         */
        constructor(el) {
            this.list = new List(el.querySelector('.js-menu'), 'To Do List', []);

            this.list.render();

            this.list.addEventListener('addForm', (event) => {
                let form = new Form({
                    el: event.detail['element'],
                    index: event.detail['item'],
                    button: true
                });
                form.render();

                form.addEventListener('save', (event) => {
                    this.list.addItem({
                        item: event.detail['item'],
                        value: event.detail['value']
                    });
                });
            });

            this.list.addEventListener('addFormList', (event) => {
                let form = new Form({
                    el: event.detail['element'],
                    index: event.detail['item'],
                    button: false
                });
                form.render();

                form.addEventListener('save', (event) => {
                    this.list.addList({
                        value: event.detail['value']
                    });
                });
            });

            this.list.addEventListener('saveData', ()=>{
                this.uploadData();
            });

            this.loadData();
        }

        /**
         * Загрузка данных с сервера
         */
        loadData() {
            const url = 'https://components-todolist.firebaseio.com/toDoList/-KvlK-UHD86Isy7nal4f.json';
            const xhr = new XMLHttpRequest();


            xhr.addEventListener('readystatechange', (event) => {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        console.error('Сетевая ошибка', xhr);
                    }

                    this.list.setData(JSON.parse(xhr.responseText));
                }
            });

            xhr.open('GET', url, true);
            xhr.send();
        }

        /**
         * Загрузка данных на сервера
         */
        uploadData() {
            const url = 'https://components-todolist.firebaseio.com/toDoList/-KvlK-UHD86Isy7nal4f.json';
            const xhr = new XMLHttpRequest();

            xhr.open('PUT', url, true);

            xhr.onload = (event) =>{
                console.log('DONE');
            };
            xhr.send(JSON.stringify(this.list.data));
        }
    }

    window.App = App;
})();
