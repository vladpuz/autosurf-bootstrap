import path from 'path'
import fs from 'fs-extra'
import { ConfigType } from '../types/ConfigType'

export const removeSurfers = async (surfers: ConfigType['surfersOrder']): Promise<void> => {
  const removeOperations = surfers.map(async (surfer) => {
    return await fs.readdir(path.join(__dirname, `../../surfers/${surfer}`))
      .then((files) => {
        files
          .filter((file) => file !== 'copy' && file !== 'proxies.txt')
          .map(async (file) => {
            return await fs.remove(path.join(__dirname, `../../surfers/${surfer}/${file}`))
          })
      })
      .catch((err) => {
        throw err
      })
  })

  await Promise.all(removeOperations.flat())
}
