import { expect } from '@playwright/test'
export class PaymentPage {
  constructor(page) {
    this.page = page

    this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                            .locator('[data-qa="discount-code"]')
    this.discountInput = page.getByPlaceholder('Discount code')
    this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
    this.totalValue = page.locator('[data-qa="total-value"]')
    this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
    this.discountActivateMessage = page.locator('[data-qa="discount-active-message"]')
    this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]')
    this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]')
    this.creditCardExpInput = page.locator('[data-qa="valid-until"]')
    this.creditCardCvcInput = page.locator('[data-qa="credit-card-cvc"]')
    this.payButton = page.locator('[data-qa="pay-button"]')
    this.paymentSuccessMessage = page.getByRole('heading', { name: 'Thank you for shopping with us!' })
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor()
    const code = await this.discountCode.innerText()
    await this.discountInput.waitFor()
    await this.discountInput.fill(code)
    await expect(this.discountInput).toHaveValue(code)

    // Option 2 for laggy inputs: slow typing
    // await this.discountInput.focus()
    // await this.page.keyboard.type(code, { delay: 1000 })
    // expect(await this.discountInput.inputValue()).toBe(code)

    expect(await this.discountedValue.isVisible()).toBe(false)
    expect(await this.discountActivateMessage.isVisible()).toBe(false)
    await this.activateDiscountButton.waitFor()
    await this.activateDiscountButton.click()
    await this.discountActivateMessage.waitFor()
    const activatedMessage = await this.discountActivateMessage.innerText()
    expect(await this.discountActivateMessage.innerText()).toBe(activatedMessage)
    await this.discountedValue.waitFor()
    const discountValueText = await this.discountedValue.innerText()
    const discountValueOnlyStringNumber = discountValueText.replace("$", "")
    const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)
    await this.totalValue.waitFor()
    const totalValueText = await this.totalValue.innerText()
    const totalValueOnlyStringNumber = totalValueText.replace("$", "")
    const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)
    expect(discountValueNumber).toBeLessThan(totalValueNumber)
  }

  fillPaymentDetails = async (paymentDetails) => {
    await this.creditCardOwnerInput.waitFor()
    await this.creditCardOwnerInput.fill(paymentDetails.cardOwner)
    await this.creditCardNumberInput.waitFor()
    await this.creditCardNumberInput.fill(paymentDetails.cardNumber)
    await this.creditCardExpInput.waitFor()
    await this.creditCardExpInput.fill(paymentDetails.expirationDate)
    await this.creditCardCvcInput.waitFor()
    await this.creditCardCvcInput.fill(paymentDetails.cvc)
  }

  completePayment = async () => {
    await this.payButton.waitFor()
    await this.payButton.click()
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    const successMessage = await this.paymentSuccessMessage.innerText()
    await expect(this.paymentSuccessMessage).toHaveText(successMessage)
  }
}
