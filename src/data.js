export default {
  variant: [
    {
      label: 'krátkodobé poistenie',
      id: 'kratkodobe',
      value: {
        zakladny: 1.2,
        rozsireny: 1.8,
        extra: 2.4,
      },
    },
    {
      label: 'celoročné poistenie',
      id: 'celorocne',
      value: {
        zakladny: 39,
        rozsireny: 49,
        extra: 59,
      },
    },
  ],
  package: [
    {
      label: 'základný',
      id: 'zakladny',
   },
    {
      label: 'rozšírený',
      id: 'rozsireny',
   },
    {
      label: 'extra',
      id: 'extra',
   },
  ],
  reinsurance: [
    {
      label: 'storno cesty',
      id: 'storno_cesty',
      value: {
        kratkodobe: 1.5,
        celorocne: 1.2,
      },
    },
    {
      label: 'športové aktivity',
      id: 'sportove_aktivity',
      value: {
        kratkodobe: 1.3,
        celorocne: 1.1,
      },
    },
  ],
  persons: [1,2,3],
}