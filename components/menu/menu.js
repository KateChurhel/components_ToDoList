;
(function() {
    'use strict';

    /**
     * Компонента "Список"
     */
    class List {
        /**
         * @constructor
         * @param  {HTMLElement} el
         * @param {String} nameMenu
         * @param {Array} data
         */
        constructor(el, nameMenu, data = []) {
            this.el = el;
            this.data = data;
            this.nameMenu = nameMenu;

            this.currentTarget;
        }

        /**
         * Сохранение данных
         */
        saveData() {
            this.trigger('saveData', {});
        }

        /**
         * Обновление данных списка
         * @param {Array} data
         */
        setData(data) {
            this.data = data;
            this.render();
        }

        /**
         * Развешиваем события
         */
        _initEvents() {
            this.el.addEventListener('click', this._onClick.bind(this));

            let allInput = this.el.querySelectorAll('input[type=\'checkbox\'');

            for (let i=0; i<allInput.length; i++) {
                allInput[i].addEventListener('change', this._onChange.bind(this));
            }
        }

        /**
         * Обработка нажатий мыши
         * @param {Event} event
         */
        _onClick(event) {
            let $target = event.target;

            if ($target.tagName === 'LI') {
                let $el = this.el.querySelectorAll('.js-menu-items');
                let $elList = this.el.querySelectorAll('.js-name-list');

                for (let i = 0; i < $el.length; i++) {
                    if ($el[i].dataset.item === $target.dataset.item) {
                        $el[i].style.display = '';

                        $elList[i].classList.add('js-active-list');

                        this._initForm($el[i], $target.dataset.item);
                    } else {
                        $el[i].style.display = 'none';
                        $elList[i].classList.remove('js-active-list');
                    }
                }
            }

            if ($target.classList.contains('remove-btn') && $target !== this.currentTarget) {
                event.preventDefault();

                if ($target.parentNode.tagName === 'LABEL') {
                    let $label = $target.parentNode;
                    let idLabel = $label.getAttribute('for');

                    this.removeItem(idLabel);
                } else {
                    this.removeList($target.parentNode.dataset.item);
                }
            }

            this.currentTarget = $target;
        }

        /**
         * Обработка checkbox
         * @param {Event} event
         */
        _onChange(event) {
            let item = event.target.id.split('-');

            this.data[item[1]]['items'][item[2]]['checked'] = event.target.checked;

            this.saveData();
        }

        /**
         * Генерируем событие для добавления формы
         * @param {HTMLElement} $el
         * @param {String} index
         */
        _initForm($el, index) {
            if (!$el.querySelector('.js-form-add')) {
                this.trigger('addForm', {
                    element: $el,
                    item: index
                });
            }
        }

        /**
         * Удаляем элемент списка
         * @param {Array} index
         */
        removeItem(index) {
            index = index.split('-');

            this.data[index[1]]['items'].splice(parseInt(index[2]), 1);

            this.saveData();
            this.update(index[1]);
        }

        /**
         * Удаляем списка
         * @param {Array} index
         */
        removeList(index) {
            this.data.splice(parseInt(index), 1);

            this.saveData();
            // if (index > this.data.length-1) index = this.data.length-1;
            this.render();
        }

        /**
         * Создаем HTML элементов списков
         */
        _initItem() {
            let $el;

            let getItem = (acc, item, i) => {
                return acc += `
                    <input id="item-${$el.dataset.item}-${i}"  type="checkbox" ${item['checked'] ? 'checked' : ''}>
                    <label for="item-${$el.dataset.item}-${i}">${item['title']}<i class="remove-btn">x</i></label>`;
            };

            this.data.forEach((item, index) => {
                $el = document.createElement('div');
                $el.className = 'js-menu-items';
                $el.dataset.item = index;

                let html = '<div class=\'js-menu-items-el\'>';

                if (item['items']) {
                    html += item['items'].reduce(getItem, '');
                }

                html += `<h2 class="undone" aria-hidden="true">Not Done</h2>
                         <h2 class="done" aria-hidden="true">Done</h2></div>`;

                $el.innerHTML = html;
                $el.style.display = 'none';

                this.el.appendChild($el);
            });
        }

        /**
         * Добавление элемента списка
         * @param {Object} detail
         */
        addItem({item, value}) {
            let data = this.data[parseInt(item)];

            if (!data['items']) {
                data['items'] = [];
            }

            this.data[parseInt(item)]['items'].push({
                title: value,
                checked: false
            });

            this.saveData();
            this.update(item);
        }

        /**
         * Добавление списка
         * @param {Object} detail
         */
        addList({value}) {
            this.data.push({
                'title': value,
                'items': []
            });
            this.update(''+(this.data.length-1));
        }

        /**
         * Обновление страницы
         * @param {String} index Индекс активного элемента левого списка
         */
        update(index) {
            this.render();
            let arr = document.querySelectorAll('.js-menu-items');
            let $elList = this.el.querySelectorAll('.js-name-list');

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].dataset.item === index) {
                    arr[i].style.display = '';

                    $elList[i].classList.add('js-active-list');

                    this._initForm(arr[i], index);

                    break;
                }
            }
        }

        /**
         * Создаем HTML - левый список
         */
        render() {
            let getItem = (acc, item, i) => {
                return acc += `<li class="js-name-list" data-item="${i}">${item['title']}<i class="remove-btn">x</i></li>`;
            };

            this.el.innerHTML = `
                <h1>${this.nameMenu}</h1>
                <ul class="js-left-menu">${this.data.reduce(getItem, '')}
                <li></li></ul>`;

            this.trigger('addFormList', {
                element: this.el.querySelector('.js-left-menu').lastChild,
                item: 0
            });

            this._initItem();
            this._initEvents();
        }

        /**
         * Подписка на события
         * @param {string} eventName
         * @param {Function} callback
         */
        addEventListener(eventName, callback) {
            this.el.addEventListener(eventName, callback);
        }

        /**
         * Генерация события на элементе
         * @param {string} eventName
         * @param {*} eventData
         */
        trigger(eventName, eventData) {
            let event = new CustomEvent(eventName, {
                detail: eventData
            });

            this.el.dispatchEvent(event);
        }
    }

    // export
    window.List = List;
})();
