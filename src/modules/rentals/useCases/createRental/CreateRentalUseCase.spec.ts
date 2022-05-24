import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppErrors";

import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let createCarUseCase: CreateCarUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJsProvider = new DayjsDateProvider();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await createCarUseCase.execute({
      name: "Car1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1000",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Car1",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1000",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      });

      await createRentalUseCase.execute({
        user_id: "test_same_user",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "test_same_user",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Car1",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1000",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      });

      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "321",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Car1",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1000",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      });

      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
