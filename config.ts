// Настройки скриптов
// Время задается в секундах

export const config = {
  // Запуск автосерфингов с windows
  autoStart: true,
  // Задержка перед запуском автосерфингов
  systemStartTimeout: 5,
  // Задержка после запуска каждой копии любого автосерфинга
  surferStartTimeout: 10,
  // Интервал сбора данных мониторинга
  monitoringInterval: 10,
  // Порядок запуска разных автосерфингов
  surfersOrder: [
    'webisida',
    'simple'
  ] as const
}
