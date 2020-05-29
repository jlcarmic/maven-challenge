const models = require('../models')

const getNumbers = async (request, response) => {
  try {
    const numbersList = await models.Numbers.findAll({ attributes: ['number', 'times'] })

    return response.send(numbersList)
  } catch (error) {
    return response.status(500).send('Unknown error attempting to retrieve numbers, please try again')
  }
}

const saveNumber = async (request, response) => {
  try {
    const { number } = request.body

    if (!number) { return response.status(400).send('The following parameter is required: number') }

    const [entry, wasCreated] = await models.Numbers.findOrCreate({ where: { number } })

    if (wasCreated) { return response.send({ number: entry.number, times: entry.times }) }

    const updatedTimes = entry.times + 1

    await models.Numbers.update({ times: updatedTimes }, { where: { number: entry.number } })

    return response.send({ number: entry.number, times: updatedTimes })
  } catch (error) {
    return response.status(500).send('Unknown error attempting to save number, please try again')
  }
}

const updateNumber = async (request, response) => {
  try {
    const { number, increment_value } = request.body

    if (!number || !increment_value) {
      return response.status(400).send('The following parameters is required: number, increment_value')
    }

    const incrementValue = parseInt(increment_value)

    if (isNaN(incrementValue) || incrementValue < 1) {
      return response.status(400).send('The increment_value parameter must be a number greater than 0')
    }

    const entry = await models.Numbers.findOne({ where: { number } })

    if (!entry) { return response.status(400).send('That number does not exist, you cannot increment it') }

    const updatedTimes = entry.times + incrementValue

    await models.Numbers.update({ times: updatedTimes }, { where: { number: entry.number } })

    return response.send({ number: entry.number, times: updatedTimes })
  } catch (error) {
    return response.status(500).send('Unknown error attempting to update number, please try again')
  }
}

module.exports = { getNumbers, saveNumber, updateNumber }
