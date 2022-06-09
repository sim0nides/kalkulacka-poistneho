import React, {useState} from 'react'
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Center,
  Container,
  Stack,
  VStack,
  Text,
  Select,
  Input,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Heading,
  theme,
} from '@chakra-ui/react'
import data from './data'

const formatCurrency = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)

// including end date
const daysBetween = (start, end) => 
  (((new Date(end)).getTime() - (new Date(start)).getTime()) / (1000 * 3600 * 24) + 1)

const App = () => {
  const [insurance, setInsurance] = useState(undefined)
  const [variant, setVariant] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [_package, setPackage] = useState('')
  const [reinsurance, setReinsurance] = useState([])
  const [persons, setPersons] = useState(data.persons[0].toString())
  const [errors, setErrors] = useState({
    variant: null,
    startDate: null,
    endDate: null,
    package: null,
    persons: null,
  })

  const setErrorProp = (prop, value) => setErrors(state => ({...state, [prop]: value}))

  const isReinsuranceChecked = value => reinsurance.includes(value)
  const setReinsuranceCheck = (checked, value) => (
    checked 
      ? setReinsurance(state => !state.includes(value) ? [...state, value] : state)
      : setReinsurance(state => state.filter(i => i !== value))
  )

  const onVariantChange = value => {
    setEndDate('')
    setVariant(value)
  }

  const validate = () => {
    let valid = true

    if (!variant) {
      valid = false
      setErrorProp('variant', true)
    } else {
      setErrorProp('variant', null)
    }

    if (!startDate) {
      valid = false
      setErrorProp('startDate', true)
    } else {
      setErrorProp('startDate', null)
    }

    if (variant === 'kratkodobe' && (!endDate || daysBetween(startDate, endDate) < 1)) {
      valid = false
      setErrorProp('endDate', 'Dátum musí byť vačší ako začiatok poistenia.')
    } else {
      setErrorProp('endDate', null)
    }

    if (!_package) {
      valid = false
      setErrorProp('package', true)
    } else {
      setErrorProp('package', null)
    }

    if (!parseInt(persons)) {
      valid = false
      setErrorProp('persons', true)
    } else {
      setErrorProp('persons', null)
    }

    return valid
  }

  const onSubmit = () => {
    if (validate()) {
      const personsVal = parseInt(persons)  
      const tariffVal = data.variant.find(i => i.id === variant)?.value?.[_package]
      const reinsuranceVal = reinsurance
        .map(i => data.reinsurance.find(j => j.id === i).value[variant])
        .reduce((prev, current) => prev * current, 1)
      const baseVal = tariffVal * personsVal * reinsuranceVal

      if (variant === 'kratkodobe') {
        setInsurance(daysBetween(startDate, endDate) * baseVal)
      } else if (variant === 'celorocne') {
        setInsurance(baseVal)
      }
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" color='gray.800'>
        <Box py='4' minH='100vh'>
          <Heading mb='8'>Cestovné poistenie</Heading>
          <Container maxW='container.md'>
            <Center>
              <VStack spacing='4'>
                <FormControl isRequired isInvalid={!!errors.variant}>
                  <FormLabel htmlFor='variant'>Variant poistenia</FormLabel>
                  <Select
                    id='variant'
                    placeholder='Vyberte variant poistenia...'
                    w='sm'
                    value={variant}
                    onChange={e => onVariantChange(e.target.value)}
                  >
                    {data.variant.map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.startDate}>
                  <FormLabel htmlFor='start_date'>Začiatok poistenia</FormLabel>
                  <Input
                    id='start_date'
                    type='date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired={true} isInvalid={!!errors.endDate}>
                  <FormLabel htmlFor='end_date'>Koniec poistenia</FormLabel>
                  <Input
                    id='end_date'
                    type='date'
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    isDisabled={variant === 'celorocne'}
                  />
                  {errors.endDate && <FormErrorMessage>{errors.endDate}</FormErrorMessage>}
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.package}>
                  <FormLabel htmlFor='package'>Balík</FormLabel>
                  <Select
                    id='package'
                    placeholder='Vyberte balík...'
                    w='sm'
                    value={_package}
                    onChange={e => setPackage(e.target.value)}
                  >
                    {data.package.map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor='reinsurance'>Pripoistenia</FormLabel>
                  <Stack>
                    {data.reinsurance.map(i => (
                      <Checkbox
                        key={i.id}
                        value={i.id}
                        onChange={e => setReinsuranceCheck(e.target.checked, i.id)}
                        isChecked={isReinsuranceChecked(i.id)}
                      >{i.label}</Checkbox>
                    ))}
                  </Stack>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.persons}>
                  <FormLabel htmlFor='persons'>Počet osôb</FormLabel>
                  <RadioGroup value={persons} onChange={setPersons}>
                    <Stack direction='row'>
                      {data.persons.map(i => (
                        <Radio key={i} value={i.toString()}>{i}</Radio>
                      ))}
                    </Stack>
                  </RadioGroup> 
                </FormControl>
                <Button colorScheme='teal' onClick={onSubmit}>Vypočítať</Button>
                {insurance !== undefined && (
                  <Text fontSize='4xl'>{`Suma: ${formatCurrency(insurance)}`}</Text>
                )}
              </VStack>
            </Center>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
