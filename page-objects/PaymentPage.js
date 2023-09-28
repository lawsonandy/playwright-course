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
}
