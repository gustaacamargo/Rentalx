import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defautOptions = await getConnectionOptions();

  return createConnection(defautOptions);
};
