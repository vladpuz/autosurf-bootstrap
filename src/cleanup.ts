import chalk from 'chalk'
import { removeSurfers } from './cleanup/removeSurfers'
import { resetSandboxie } from './cleanup/resetSandboxie'
import { resetProxyCap } from './cleanup/resetProxyCap'
import { removeStartBat } from './cleanup/removeStartBat'
import { removeAutoStart } from './cleanup/removeAutoStart'
import { config } from '../config'

const cleanup = async (): Promise<void> => {
  const { autoStart, surfersOrder } = config

  try {
    await removeSurfers(surfersOrder)
    console.log(`Удаление автосерфингов - ${chalk.green('успешно')}`)
  } catch (err) {
    console.log(`Удаление автосерфингов - ${chalk.red('ошибка')}`, err)
  }

  try {
    await resetSandboxie()
    console.log(`Сброс Sandboxie - ${chalk.green('успешно')}`)
  } catch (err) {
    console.log(`Сброс Sandboxie - ${chalk.red('ошибка')}`, err)
  }

  try {
    await resetProxyCap()
    console.log(`Сброс ProxyCap - ${chalk.green('успешно')}`)
  } catch (err) {
    console.log(`Сброс ProxyCap - ${chalk.red('ошибка')}`, err)
  }

  try {
    await removeStartBat()
    console.log(`Удаление start.bat - ${chalk.green('успешно')}`)
  } catch (err) {
    console.log(`Удаление start.bat - ${chalk.red('ошибка')}`, err)
  }

  if (autoStart) {
    try {
      await removeAutoStart()
      console.log(`Удаление автозапуска - ${chalk.green('успешно')}`)
    } catch (err) {
      console.log(`Удаление автозапуска - ${chalk.red('ошибка')}`, err)
    }
  }
}

cleanup()
  .then(() => {
    console.log()
    console.log(chalk.bgGreen('Очистка произведена успешно'))
  })
  .catch(() => {
    console.log()
    console.log(chalk.bgRed('Произошла непредвиденная ошибка'))
  })
