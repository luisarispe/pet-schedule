export interface Pet {
  name: string;
  sex: string;
  age: number;
}

export interface Species {
  name: string;
}

export interface User {
  email: string;
  password: string;
  fullName: string;
}

export const dataUser: User = {
  email: 'test@gmail.com',
  password: 'Abc12345',
  fullName: 'John Doe',
};

export const dataSpecies: Species = {
  name: 'perro',
};

export const dataPet: Pet[] = [
  {
    name: 'Cachupin',
    sex: 'hembra',
    age: 1,
  },
  {
    name: 'Mochiberto',
    sex: 'macho',
    age: 4,
  },
  {
    name: 'Firulais',
    sex: 'macho',
    age: 2,
  },
  {
    name: 'Boby',
    sex: 'macho',
    age: 10,
  },
  {
    name: 'Michi',
    sex: 'hembra',
    age: 2,
  },
];
