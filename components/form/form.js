;
(function() {
    'use strict';

    /**
     * Компонента "Форма"
     */
    class Form {
        /**
         * @constructor
         * @param  {Object} ops
         */
        constructor({el, index, button}) {
            this.el = el;
            this.index = index;
            this.button = button;

            this._initEvents();
        }

        /**
         * Создаем HTML
         */
        render() {
            let element = document.createElement('form');
            element.classList.add('form', 'js-form-add');
            element.dataset.item = this.index;
            element.innerHTML =`
            <div>
                <input class="form-input ${this.button ? '' : 'form-list'}"
                    type="text" name="data"
                    required="required"
                    placeholder="+ Добавить"/> 

                ${this.button ? '<button class="form-btn" type="submit">Сохранить</button>' : ''}
            </div>`;

            this.el.insertBefore(element, this.el.firstChild);
        }


        /**
         * Развешиваем события
         */
        _initEvents() {
            this.el.addEventListener('submit', this._onSubmit.bind(this));
        }


        /**
         * Отправка данных формы
         * @param {Event} event
         */
        _onSubmit(event) {
            event.preventDefault();

            let $input = this.el.querySelector('input[name="data"');

            this.trigger('save', {
                item: $input.parentNode.parentNode.dataset.item,
                value: $input.value
            });
            event.target.reset();
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
    window.Form = Form;
})();
