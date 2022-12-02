export interface Pet {
  name: string;
  sex: string;
  age: number;
}

export interface Species {
  name: string;
}

export const dataSpecies: Species = {
  name: 'perro',
};

export const dataPet: Pet[] = [
  {
    name: 'Cachupin',
    sex: 'feminino',
    age: 1,
  },
  {
    name: 'Mochiberto',
    sex: 'masculino',
    age: 4,
  },
  {
    name: 'Firulais',
    sex: 'masculino',
    age: 2,
  },
  {
    name: 'Boby',
    sex: 'masculino',
    age: 10,
  },
  {
    name: 'Michi',
    sex: 'feminino',
    age: 2,
  },
];
