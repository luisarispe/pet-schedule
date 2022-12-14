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
