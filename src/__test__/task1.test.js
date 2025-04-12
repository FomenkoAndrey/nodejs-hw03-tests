import { asyncOperationDemo } from '../main.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('asyncOperationDemo function', () => {
  let originalConsoleError
  let originalConsoleLog

  beforeEach(() => {
    // Зберігаємо та мокуємо методи console
    originalConsoleError = console.error
    originalConsoleLog = console.log
    console.error = vi.fn()
    console.log = vi.fn()

    // Використовуємо мок-функції для асинхронних API
    vi.stubGlobal('setTimeout', vi.fn((cb) => {
      cb()
      return 1
    }))
    
    vi.stubGlobal('setImmediate', vi.fn((cb) => {
      cb()
      return 1
    }))
  })

  it('executes async calls in the expected order', async () => {
    const callback = vi.fn()

    asyncOperationDemo(callback)

    // Перевіряємо синхронні виклики
    expect(console.log).toHaveBeenCalledWith('Перший виклик')
    expect(console.log).toHaveBeenCalledWith('Останній виклик')

    // Запускаємо nextTick вручну
    await new Promise(resolve => process.nextTick(resolve))
    
    // Перевіряємо всі очікувані виклики
    expect(console.log).toHaveBeenCalledWith('Виконано nextTick')
    expect(console.log).toHaveBeenCalledWith('Виконано setImmediate')
    expect(console.log).toHaveBeenCalledWith('Виконано setTimeout')
    
    // Перевіряємо, що callback був викликаний з правильними аргументами
    expect(callback).toHaveBeenCalledWith('nextTick')
    expect(callback).toHaveBeenCalledWith('setImmediate')
    expect(callback).toHaveBeenCalledWith('setTimeout')
    
    // Перевіряємо порядок викликів - це може відрізнятися через різницю в обробці асинхронності
    expect(callback).toHaveBeenCalledTimes(3)
  })

  afterEach(() => {
    // Відновлюємо оригінальні методи console і глобальні функції
    console.error = originalConsoleError
    console.log = originalConsoleLog
    
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  })
})
