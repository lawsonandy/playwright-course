import { expect } from '@playwright/test'
export class PaymentPage {
  constructor(page) {
    this.page = page

    this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                            .locator('[data-qa="discount-code"]')
    this.discountCodeInput = page.getByPlaceholder('Discount code')
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor()
    const code = await this.discountCode.innerText()
    await this.discountCodeInput.waitFor()
    await this.discountCodeInput.fill(code)
    await expect(this.discountCodeInput).toHaveValue(code)
  }
}
