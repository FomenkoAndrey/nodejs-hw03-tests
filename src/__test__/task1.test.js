import { asyncOperationDemo } from '../main.js'

describe('asyncOperationDemo function', () => {
  let originalConsoleError
  let originalConsoleLog

  beforeEach(() => {
    // Зберігаємо та мокуємо методи console
    originalConsoleError = console.error
    originalConsoleLog = console.log
    console.error = jest.fn()
    console.log = jest.fn()

    jest.useFakeTimers()
  })

  it('executes async calls in the expected order', () => {
    const callback = jest.fn()

    asyncOperationDemo(callback)

    expect(console.log).toHaveBeenCalledWith('Перший виклик')
    expect(console.log).toHaveBeenCalledWith('Останній виклик')

    // Виконання всіх типів таймерів
    process.nextTick(() => {
      expect(console.log).toHaveBeenCalledWith('Виконано nextTick')
      expect(callback).toHaveBeenCalledWith('nextTick')
    })

    jest.runAllTimers()

    expect(console.log).toHaveBeenCalledWith('Виконано setImmediate')
    expect(callback).toHaveBeenCalledWith('setImmediate')
    expect(console.log).toHaveBeenCalledWith('Виконано setTimeout')
    expect(callback).toHaveBeenCalledWith('setTimeout')

    // Перевірка порядку викликів callback
    expect(callback.mock.calls).toEqual([['nextTick'], ['setImmediate'], ['setTimeout']])
  })

  afterEach(() => {
    // Відновлюємо оригінальні методи console
    console.error = originalConsoleError
    console.log = originalConsoleLog

    jest.restoreAllMocks()
    jest.useRealTimers()
  })
})
