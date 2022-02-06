import path from 'path'
import fs from 'fs-extra'

export const removeStartBat = async (): Promise<void> => {
  await fs.remove(path.join(__dirname, '../../start.bat'))
}
