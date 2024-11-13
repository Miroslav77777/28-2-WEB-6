const quantityInput = document.getElementById('quantity');
        const quantityError = document.getElementById('quantity-error');
        const serviceTypeRadios = document.querySelectorAll('input[name="service-type"]');
        const optionsSelect = document.getElementById('options');
        const propertyCheckbox = document.getElementById('property');
        const calculateButton = document.getElementById('calculate-button');
        const resultDiv = document.getElementById('result');
        const optionsGroup = document.getElementById('options-group');
        const propertyGroup = document.getElementById('property-group');

        // Данные о товарах из JSON файла
// Данные о товарах из JSON файла
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Обработка данных и отрисовка калькулятора
                // ...

                // Добавление обработчика события DOMContentLoaded
                window.addEventListener('DOMContentLoaded', calculatePrice);

                // Добавление обработчиков событий для вызывания calculatePrice при изменении значений калькулятора
                quantityInput.addEventListener('input', calculatePrice);
                serviceTypeRadios.forEach(radio => radio.addEventListener('change', calculatePrice));
                optionsSelect.addEventListener('change', calculatePrice);
                propertyCheckbox.addEventListener('change', calculatePrice);

                serviceTypeRadios.forEach(radio => {
                    radio.addEventListener('change', () => {
                        updateOptionsAndProperty(radio.value);
                        calculatePrice(); // Пересчитать цену при изменении типа услуги
                    });
                });

                optionsSelect.addEventListener('change', calculatePrice);
                propertyCheckbox.addEventListener('change', calculatePrice);
                quantityInput.addEventListener('input', validateQuantity); // Валидация при вводе

                function updateOptionsAndProperty(serviceType) {
                    const serviceData = data[serviceType - 1]; // Получить данные по типу услуги
                    optionsSelect.innerHTML = '';
                    propertyCheckbox.checked = false;

                    if (serviceData.options) {
                        // Отобразить опции
                        optionsGroup.style.display = 'block';
                        serviceData.options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option;
                            optionElement.text = option;
                            optionsSelect.appendChild(optionElement);
                        });
                    } else {
                        optionsGroup.style.display = 'none';
                    }

                    if (serviceData.property) {
                        // Отобразить свойство
                        propertyGroup.style.display = 'block';
                        propertyCheckbox.value = serviceData.property;
                        propertyCheckbox.nextElementSibling.innerText = serviceData.property;
                    } else {
                        propertyGroup.style.display = 'none';
                    }
                }

                function calculatePrice() {
                    // Проверка, что количество валидно
                    if (!validateQuantity()) {
                        resultDiv.textContent = ``;
                        return; // Не выполнять расчет, если количество некорректно
                    }
                    const serviceType = parseInt(document.querySelector('input[name="service-type"]:checked').value);
                    const quantity = parseInt(quantityInput.value);
                    const serviceData = data[serviceType - 1];
                    let price = serviceData.basePrice * quantity;

                    if (serviceData.options && serviceData.optionsPrice) {
                        price += serviceData.optionsPrice[optionsSelect.value];
                    }

                    if (serviceData.property && propertyCheckbox.checked) {
                        price += serviceData.propertyPrice;
                    }

                    resultDiv.textContent = `Стоимость: ${price} руб.`;
                }

                // Валидация количества (регулярное выражение)
                function validateQuantity() {
                    const quantity = quantityInput.value;
                    const regex = /^\d+$/; // Регулярное выражение для целых положительных чисел
                    if (regex.test(quantity) && quantity > 0) {
                        quantityError.textContent = '';
                        return true;
                    } else {
                        quantityError.textContent = 'Введите целое положительное число';
                        return false;
                    }
                }

                // Вызов функции инициализации для отображения элементов формы
                updateOptionsAndProperty(1); 
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
