const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const {
  after, afterEach, before, beforeEach, describe, it,
} = require('mocha')
const models = require('../../models')
const { getNumbers, saveNumber, updateNumber } = require('../../controllers/numbers')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Numbers', () => {
  let response
  let sandbox
  let stubbedFindAll
  let stubbedFindOne
  let stubbedFindOrCreate
  let stubbedSend
  let stubbedStatus
  let stubbedStatusDotSend
  let stubbedUpdate

  before(() => {
    sandbox = createSandbox()

    stubbedFindAll = sandbox.stub(models.Numbers, 'findAll')
    stubbedFindOne = sandbox.stub(models.Numbers, 'findOne')
    stubbedFindOrCreate = sandbox.stub(models.Numbers, 'findOrCreate')
    stubbedUpdate = sandbox.stub(models.Numbers, 'update')

    stubbedSend = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()

    response = {
      send: stubbedSend,
      status: stubbedStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('getNumbers', () => {
    it('returns a list of the numbers and their counts', async () => {
      stubbedFindAll.returns([{ number: 1, times: 10 }])

      await getNumbers({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['number', 'times'] })
      expect(stubbedSend).to.have.been.calledWith([{ number: 1, times: 10 }])
    })

    it('responds with a 500 when an error occurs retrieving the number list', async () => {
      stubbedFindAll.throws('ERROR!')

      await getNumbers({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['number', 'times'] })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('Unknown error attempting to retrieve numbers, please try again')
    })
  })

  describe('saveNumber', () => {
    it('returns the newly created number when the number provided has not been seen before', async () => {
      stubbedFindOrCreate.returns([{ number: 6, times: 1 }, true])
      const request = { body: { number: '6' } }

      await saveNumber(request, response)

      expect(stubbedFindOrCreate).to.have.been.calledWith({ where: { number: '6' } })
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedSend).to.have.been.calledWith({ number: 6, times: 1 })
    })

    it('returns the updated number when the number has previously been seen', async () => {
      stubbedFindOrCreate.returns([{ number: 6, times: 1 }, false])
      const request = { body: { number: '6' } }

      await saveNumber(request, response)

      expect(stubbedFindOrCreate).to.have.been.calledWith({ where: { number: '6' } })
      expect(stubbedUpdate).to.have.been.calledWith({ times: 2 }, { where: { number: 6 } })
      expect(stubbedSend).to.have.been.calledWith({ number: 6, times: 2 })
    })

    it('responds with a 400 when no number is provided', async () => {
      const request = { body: {} }

      await saveNumber(request, response)

      expect(stubbedFindOrCreate).to.have.callCount(0)
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('The following parameter is required: number')
    })

    it('responds with a 500 when an error is throw', async () => {
      stubbedFindOrCreate.throws('ERROR!')
      const request = { body: { number: '6' } }

      await saveNumber(request, response)

      expect(stubbedFindOrCreate).to.have.been.calledWith({ where: { number: '6' } })
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('Unknown error attempting to save number, please try again')
    })
  })

  describe('updateNumber', () => {
    it('it increments the number by the interval provided', async () => {
      stubbedFindOne.returns({ number: 6, times: 1 })
      const request = { body: { number: '6', increment_value: '4' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { number: '6' } })
      expect(stubbedUpdate).to.have.been.calledWith({ times: 5 }, { where: { number: 6 } })
      expect(stubbedSend).to.have.been.calledWith({ number: 6, times: 5 })
    })

    it('responds with a 400 when the number is not provided', async () => {
      const request = { body: { increment_value: '4' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.callCount(0)
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('The following parameters is required: number, increment_value')
    })

    it('responds with a 400 when the increment_value is not provided', async () => {
      const request = { body: { number: '4' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.callCount(0)
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('The following parameters is required: number, increment_value')
    })

    it('responds with a 400 when the increment_value is not a number', async () => {
      const request = { body: { number: '4', increment_value: 'a' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.callCount(0)
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('The increment_value parameter must be a number greater than 0')
    })

    it('responds with a 400 when the increment_value is less than 1', async () => {
      const request = { body: { number: '4', increment_value: '0' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.callCount(0)
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('The increment_value parameter must be a number greater than 0')
    })

    it('response with a 400 when the number has not been seen before', async () => {
      stubbedFindOne.returns(null)
      const request = { body: { number: '4', increment_value: '3' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { number: '4' } })
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('That number does not exist, you cannot increment it')
    })

    it('responds with a 500 when an error is throw', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { body: { number: '4', increment_value: '3' } }

      await updateNumber(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { number: '4' } })
      expect(stubbedUpdate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been
        .calledWith('Unknown error attempting to update number, please try again')
    })
  })
})
