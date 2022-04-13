import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi 1",
      description: "Carro 1",
      daily_rate: 10.0,
      license_plate: "DEF-1",
      fine_amount: 100,
      brand: "Audi",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi 2",
      description: "Carro 2",
      daily_rate: 10.0,
      license_plate: "DEF-2",
      fine_amount: 100,
      brand: "Audi",
      category_id: "category_id_2",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "category_id_2",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi 3",
      description: "Carro 3",
      daily_rate: 10.0,
      license_plate: "DEF-3",
      fine_amount: 100,
      brand: "Audi",
      category_id: "category_id_3",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Audi 3",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi 4",
      description: "Carro 4",
      daily_rate: 10.0,
      license_plate: "DEF-4",
      fine_amount: 100,
      brand: "Audi",
      category_id: "category_id_4",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category_id_4",
    });

    expect(cars).toEqual([car]);
  });
});
