import { Connection, createConnection } from 'typeorm';

export const createDB = async (): Promise<Connection> =>
  createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'ghibli_graphql',
    username: 'root',
    password: 'qwer1234',
    logging: !(process.env.NODE_ENV === 'production'),
    synchronize: true, // entities에 명시된 데이터 모델들을 DB에 자동으로 동기화합니다.
    entities: [], // entities 폴더의 모든 데이터 모델이 위치해야 합니다.
  });