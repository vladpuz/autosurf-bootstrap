import colors from 'colors';
import { createWebisidaCopies } from './utils/createWebisidaCopies';
import { createSandboxieConfig } from './utils/createSandboxieConfig';
import { createProxyCapConfig } from './utils/createProxyCapConfig';
import { createStartBat } from './utils/createStartBat';

const bootstrap = async () => {
  await createWebisidaCopies();
  await createSandboxieConfig();
  await createProxyCapConfig();
  await createStartBat();
};

bootstrap()
  .then(() => {
    console.log(colors.green('\nВсе операции выполнены успешно'));
  })
  .catch(() => {
    console.log(colors.red('\nПроизошла непредвиденная ошибка'));
  });
