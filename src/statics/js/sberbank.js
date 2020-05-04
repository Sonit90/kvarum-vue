let calculatorOptions = {
  apiKey: '728a2644-fefc-43c1-9054-5806c8fda7ef', // Используйте этот API-key
  excludedProduct: [], // укажите продукт, который нужно исключить
  schema: {
    product: 3, // 4 - это новостройка, укажите значение, которое нужно вам
    realtyDiscount: true // оставьте одно значение
  },
  excludedDiscounts: ['realtyDiscount'], // укажите дисконт, который нужно скрыть


// Также, можно подписаться на события. Необходимо заменить пустые функции на свои реализации
// изменение параметров расчета
  onChangeParams: function (e) {}, // успешное окончание расчета
  onChangeResults: function (e) {}, // ошибка при выполненииы расчета
  onFailedResults: function (e) {}
};
domclick.mortgage.ready(function (mortgage) {
  mortgage(
    'calculator',
    { calculator: calculatorOptions },
    { cssSuffix: 'universal' }
  );
})
